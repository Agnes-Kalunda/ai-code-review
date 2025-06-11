from rest_framework import serializers
from .models import CodeReview, AnalysisMetrics, ReviewFeedback
import os

class ReviewFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewFeedback
        fields = [
            'id', 'severity', 'category', 'title', 'description', 
            'suggestion', 'line_number', 'column_number', 'code_snippet',
            'confidence_score', 'created_at'
        ]

class AnalysisMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisMetrics
        fields = [
            'complexity_score', 'maintainability_score', 'security_score',
            'performance_score', 'critical_issues', 'major_issues',
            'minor_issues', 'suggestions', 'pylint_score',
            'flake8_violations', 'security_vulnerabilities'
        ]

class CodeReviewSerializer(serializers.ModelSerializer):
    feedback_items = ReviewFeedbackSerializer(many=True, read_only=True)
    metrics = AnalysisMetricsSerializer(read_only=True)
    
    class Meta:
        model = CodeReview
        fields = [
            'id', 'submission_type', 'uploaded_file', 'original_filename',
            'code_content', 'status', 'ai_analysis', 'analysis_summary',
            'static_analysis', 'file_size', 'lines_of_code', 'language',
            'created_at', 'updated_at', 'analysis_completed_at',
            'error_message', 'feedback_items', 'metrics'
        ]
        read_only_fields = [
            'id', 'status', 'ai_analysis', 'analysis_summary',
            'static_analysis', 'file_size', 'lines_of_code',
            'created_at', 'updated_at', 'analysis_completed_at',
            'error_message'
        ]

class CodeReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new code reviews"""
    
    class Meta:
        model = CodeReview
        fields = ['submission_type', 'uploaded_file', 'code_content', 'language']
    
    def validate(self, data):
        """Validate that either file or code content is provided"""
        submission_type = data.get('submission_type')
        uploaded_file = data.get('uploaded_file')
        code_content = data.get('code_content')
        
        if submission_type == 'file':
            if not uploaded_file:
                raise serializers.ValidationError("File is required for file submissions")
            
            # Validate file type
            allowed_extensions = ['.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.php']
            file_extension = os.path.splitext(uploaded_file.name)[1].lower()
            
            if file_extension not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
                )
            
            # Validate file size (max 1MB)
            if uploaded_file.size > 1024 * 1024:
                raise serializers.ValidationError("File size cannot exceed 1MB")
                
        elif submission_type == 'text':
            if not code_content or not code_content.strip():
                raise serializers.ValidationError("Code content is required for text submissions")
            
            # Validate code length
            if len(code_content) > 50000:  # 50KB limit for text
                raise serializers.ValidationError("Code content is too long (max 50,000 characters)")
        
        else:
            raise serializers.ValidationError("Invalid submission type")
        
        return data
    
    def create(self, validated_data):
        """Create code review and set additional fields"""
        review = super().create(validated_data)
        
        if review.submission_type == 'file' and review.uploaded_file:
            review.original_filename = review.uploaded_file.name
            review.file_size = review.uploaded_file.size
            
    
            try:
                code_content = review.get_code_content
                if code_content:
                    review.lines_of_code = len(code_content.splitlines())
            except Exception:
                pass
        
        elif review.submission_type == 'text' and review.code_content:
            review.lines_of_code = len(review.code_content.splitlines())
        
        review.save()
        return review

class CodeReviewListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing code reviews"""
    
    class Meta:
        model = CodeReview
        fields = [
            'id', 'submission_type', 'original_filename', 'status',
            'language', 'lines_of_code', 'created_at', 'analysis_completed_at'
        ]

class CodeAnalysisRequestSerializer(serializers.Serializer):
    """Serializer for manual analysis requests"""
    review_id = serializers.UUIDField()
    
    def validate_review_id(self, value):
        try:
            review = CodeReview.objects.get(id=value)
            if review.status == 'analyzing':
                raise serializers.ValidationError("Analysis is already in progress")
        except CodeReview.DoesNotExist:
            raise serializers.ValidationError("Code review not found")
        return value