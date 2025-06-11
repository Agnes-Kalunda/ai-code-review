from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
import logging

from .models import CodeReview, AnalysisMetrics, ReviewFeedback
from .serializers import (
    CodeReviewSerializer, CodeReviewCreateSerializer, 
    CodeReviewListSerializer, CodeAnalysisRequestSerializer,
    ReviewFeedbackSerializer, AnalysisMetricsSerializer
)

try:
    from .services.ai_analyzer import AICodeAnalyzer
except ImportError:
    AICodeAnalyzer = None

logger = logging.getLogger('backendApp')

class SessionTrackingMixin:
    """Mixin to add session tracking to views"""
    
    def get_user_session_data(self):
        """Get session data for user"""
        if not self.request.session.session_key:
            self.request.session.create()
        
        session_data = {
            'session_key': self.request.session.session_key,
            'reviews_created': self.request.session.get('user_reviews', []),
            'last_activity': self.request.session.get('last_activity'),
        }
        
        # Update last activity
        self.request.session['last_activity'] = timezone.now().isoformat()
        self.request.session.modified = True
        
        return session_data
    
    def log_user_activity(self, action, details=None):
        """Log user activity with session info"""
        session_data = self.get_user_session_data()
        
        log_message = f"Session {session_data['session_key']}: {action}"
        if details:
            log_message += f" - {details}"
        
        logger.info(log_message)

class CodeReviewViewSet(SessionTrackingMixin, viewsets.ModelViewSet):
    """
    ViewSet for managing code reviews
    Provides CRUD operations and custom actions
    """
    queryset = CodeReview.objects.all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'id'
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CodeReviewCreateSerializer
        elif self.action == 'list':
            return CodeReviewListSerializer
        return CodeReviewSerializer
    
    def get_queryset(self):
        """Filter queryset based on session (optional)"""
        queryset = CodeReview.objects.all()
        
        
        show_user_only = self.request.query_params.get('user_only', 'false').lower() == 'true'
        if show_user_only:
            user_reviews = self.request.session.get('user_reviews', [])
            if user_reviews:
                queryset = queryset.filter(id__in=user_reviews)
        
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        language_filter = self.request.query_params.get('language')
        if language_filter:
            queryset = queryset.filter(language=language_filter)
        
        return queryset.order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """List code reviews with session tracking"""
        self.log_user_activity("Viewed reviews list")
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve specific code review"""
        instance = self.get_object()
        self.log_user_activity("Viewed review details", f"Review ID: {instance.id}")
        return super().retrieve(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        """Create new code review with session tracking"""
        self.log_user_activity("Creating new code review")
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
    
        review = serializer.save()
        
    
        if 'user_reviews' not in request.session:
            request.session['user_reviews'] = []
        
        request.session['user_reviews'].append(str(review.id))
        request.session.modified = True
        
        self.log_user_activity("Created code review", f"Review ID: {review.id}")
        
        
        auto_analyze = request.data.get('auto_analyze', 'true').lower() == 'true'
        if auto_analyze:
            self.log_user_activity("Starting automatic analysis", f"Review ID: {review.id}")
            self._trigger_analysis(review)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            CodeReviewSerializer(review).data, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete code review with session tracking"""
        instance = self.get_object()
        self.log_user_activity("Deleting code review", f"Review ID: {instance.id}")
        
    
        user_reviews = request.session.get('user_reviews', [])
        if str(instance.id) in user_reviews:
            user_reviews.remove(str(instance.id))
            request.session['user_reviews'] = user_reviews
            request.session.modified = True
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def analyze(self, request, id=None):
        """Manually trigger analysis for a specific review"""
        review = self.get_object()
        
        if review.status == 'analyzing':
            return Response(
                {'error': 'Analysis already in progress'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.log_user_activity("Manual analysis triggered", f"Review ID: {review.id}")
        self._trigger_analysis(review)
        
        return Response(
            {'message': 'Analysis started', 'review_id': str(review.id)},
            status=status.HTTP_202_ACCEPTED
        )
    
    @action(detail=True, methods=['get'])
    def feedback(self, request, id=None):
        """Get detailed feedback for a review"""
        review = self.get_object()
        feedback_items = ReviewFeedback.objects.filter(review=review)
        
        serializer = ReviewFeedbackSerializer(feedback_items, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def metrics(self, request, id=None):
        """Get metrics for a review"""
        review = self.get_object()
        
        try:
            metrics = AnalysisMetrics.objects.get(review=review)
            serializer = AnalysisMetricsSerializer(metrics)
            return Response(serializer.data)
        except AnalysisMetrics.DoesNotExist:
            return Response(
                {'error': 'Metrics not available'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get overall statistics"""
        stats = {
            'total_reviews': CodeReview.objects.count(),
            'completed_reviews': CodeReview.objects.filter(status='completed').count(),
            'pending_reviews': CodeReview.objects.filter(status='pending').count(),
            'analyzing_reviews': CodeReview.objects.filter(status='analyzing').count(),
            'failed_reviews': CodeReview.objects.filter(status='failed').count(),
        }
        
    
        language_stats = CodeReview.objects.values('language').annotate(
            count=Count('language')
        ).order_by('-count')
        stats['languages'] = list(language_stats)
        
        
        from datetime import timedelta
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        stats['recent_activity'] = {
            'reviews_last_30_days': CodeReview.objects.filter(
                created_at__gte=thirty_days_ago
            ).count(),
            'completed_last_30_days': CodeReview.objects.filter(
                status='completed',
                analysis_completed_at__gte=thirty_days_ago
            ).count()
        }
        
        user_reviews = request.session.get('user_reviews', [])
        stats['user_session'] = {
            'reviews_in_session': len(user_reviews),
            'session_key': request.session.session_key
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['post'])
    def bulk_analyze(self, request):
        """Trigger analysis for multiple reviews"""
        review_ids = request.data.get('review_ids', [])
        
        if not review_ids:
            return Response(
                {'error': 'No review IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = CodeReview.objects.filter(
            id__in=review_ids,
            status__in=['pending', 'failed']
        )
        
        triggered_count = 0
        for review in reviews:
            self._trigger_analysis(review)
            triggered_count += 1
        
        self.log_user_activity("Bulk analysis triggered", f"{triggered_count} reviews")
        
        return Response({
            'message': f'Analysis started for {triggered_count} reviews',
            'triggered_reviews': triggered_count
        })
    
    def _trigger_analysis(self, review):
        """Trigger analysis for a code review"""
        try:
            if not AICodeAnalyzer:
                logger.error("AI Analyzer not available")
                review.status = 'failed'
                review.error_message = "AI Analyzer service not available"
                review.save()
                return
            
            review.status = 'analyzing'
            review.save()
            
    
            code_content = review.get_code_content
            if not code_content:
                review.status = 'failed'
                review.error_message = "Could not read code content"
                review.save()
                return
            

            analyzer = AICodeAnalyzer()
            analysis_results = analyzer.analyze_code(code_content, review.language)
            
            if 'error' in analysis_results:
                review.status = 'failed'
                review.error_message = analysis_results['error']
                review.save()
                return
            
            
            with transaction.atomic():
                review.ai_analysis = analysis_results.get('ai_analysis', {})
                review.static_analysis = analysis_results.get('static_analysis', {})
                review.analysis_summary = self._generate_summary(analysis_results)
                review.status = 'completed'
                review.analysis_completed_at = timezone.now()
                review.save()
                
            
                metrics_data = analysis_results.get('metrics', {})
                AnalysisMetrics.objects.update_or_create(
                    review=review,
                    defaults=metrics_data
                )
                
                
                ReviewFeedback.objects.filter(review=review).delete()
                feedback_items = analysis_results.get('feedback_items', [])
                for item in feedback_items:
                    ReviewFeedback.objects.create(
                        review=review,
                        **item
                    )
            
            logger.info(f"Analysis completed successfully for review {review.id}")
        
        except Exception as e:
            logger.error(f"Analysis failed for review {review.id}: {str(e)}", exc_info=True)
            review.status = 'failed'
            review.error_message = str(e)
            review.save()
    
    def _generate_summary(self, analysis_results):
        """Generate a summary from analysis results"""
        summary_parts = []
        
        # AI analysis summary
        if 'ai_analysis' in analysis_results and 'summary' in analysis_results['ai_analysis']:
            summary_parts.append(analysis_results['ai_analysis']['summary'])
        
        # Metrics summary
        if 'metrics' in analysis_results:
            metrics = analysis_results['metrics']
            critical = metrics.get('critical_issues', 0)
            major = metrics.get('major_issues', 0)
            minor = metrics.get('minor_issues', 0)
            
            if critical > 0:
                summary_parts.append(f"Found {critical} critical issue(s) that need immediate attention.")
            if major > 0:
                summary_parts.append(f"Found {major} major issue(s) that should be addressed.")
            if minor > 0:
                summary_parts.append(f"Found {minor} minor issue(s) for improvement.")
            
            if critical == 0 and major == 0:
                summary_parts.append("No critical or major issues found. Good work!")
        
        return " ".join(summary_parts) if summary_parts else "Analysis completed successfully."

class SessionManagementView(views.APIView):
    """Manage user sessions"""
    
    def get(self, request):
        """Get session information"""
        if not request.session.session_key:
            request.session.create()
        
        session_data = {
            'session_key': request.session.session_key,
            'user_reviews': request.session.get('user_reviews', []),
            'last_activity': request.session.get('last_activity'),
            'session_age': request.session.get_session_cookie_age(),
            'created_reviews_count': len(request.session.get('user_reviews', [])),
        }
        
        logger.info(f"Session info accessed: {request.session.session_key}")
        return Response(session_data)
    
    def delete(self, request):
        """Clear session"""
        session_key = request.session.session_key
        request.session.flush()
        
        logger.info(f"Session cleared: {session_key}")
        return Response({'message': 'Session cleared successfully'})

class HealthCheckView(views.APIView):
    """Health check endpoint"""
    
    def get(self, request):
        """Simple health check"""
        health_data = {
            'status': 'healthy',
            'timestamp': timezone.now(),
            'services': {
                'database': self._check_database(),
                'ai_analyzer': AICodeAnalyzer is not None,
            }
        }
        
        return Response(health_data)
    
    def _check_database(self):
        """Check database connectivity"""
        try:
            CodeReview.objects.count()
            return True
        except Exception:
            return False