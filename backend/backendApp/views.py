
from rest_framework import status, viewsets, views
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from django.db.models import Count
import logging

from .models import ChatSession, ChatMessage
from .serializers import (
    ChatSessionSerializer, ChatSessionListSerializer, 
    ChatMessageSerializer, SendMessageSerializer
)
from .services.ai_service import CodingChatAI

logger = logging.getLogger(__name__)

class ChatSessionViewSet(viewsets.ModelViewSet):
    
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatSessionListSerializer
        return ChatSessionSerializer
    
    def get_queryset(self):
        """Filter sessions by current user's session"""
        session_key = self.request.session.session_key
        if not session_key:
            return ChatSession.objects.none()
        
        return ChatSession.objects.filter(
            session_key=session_key
        ).prefetch_related('messages')
    
    def create(self, request, *args, **kwargs):

        if not request.session.session_key:
            request.session.create()
        
        session = ChatSession.objects.create(
            session_key=request.session.session_key,
            title="New Chat"
        )
        
        serializer = ChatSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
    
        session = self.get_object()
        serializer = SendMessageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user_message = serializer.validated_data['message']
        
        try:
            with transaction.atomic():
                
                user_msg = ChatMessage.objects.create(
                    session=session,
                    message_type='user',
                    content=user_message
                )
                
            
                if session.messages.count() == 1 and session.title == "New Chat":
                    ai_service = CodingChatAI()
                    session.title = ai_service.generate_session_title(user_message)
                    session.save()
                
                
                conversation_history = session.messages.order_by('created_at')
                
            
                ai_service = CodingChatAI()
                ai_result = ai_service.get_response(user_message, conversation_history)
                
                
                assistant_msg = ChatMessage.objects.create(
                    session=session,
                    message_type='assistant',
                    content=ai_result['response'],
                    tokens_used=ai_result.get('tokens_used'),
                    response_time=ai_result.get('response_time')
                )
                
        
                session.updated_at = timezone.now()
                session.save()
                
                return Response({
                    'user_message': ChatMessageSerializer(user_msg).data,
                    'assistant_message': ChatMessageSerializer(assistant_msg).data,
                    'session': ChatSessionSerializer(session).data
                })
        
        except Exception as e:
            logger.error(f"Error in send_message: {str(e)}")
            return Response(
                {'error': 'Failed to process message'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class QuickChatView(views.APIView):
    
    
    def post(self, request):
    
        serializer = SendMessageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user_message = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id')
        
        try:
        
            if not request.session.session_key:
                request.session.create()
            
            
            if session_id:
                try:
                    session = ChatSession.objects.get(
                        id=session_id,
                        session_key=request.session.session_key
                    )
                except ChatSession.DoesNotExist:
                    session = ChatSession.objects.create(
                        session_key=request.session.session_key,
                        title="Quick Chat"
                    )
            else:
                session = ChatSession.objects.create(
                    session_key=request.session.session_key,
                    title="Quick Chat"
                )
            
            with transaction.atomic():
            
                user_msg = ChatMessage.objects.create(
                    session=session,
                    message_type='user',
                    content=user_message
                )
                
                
                if session.messages.count() == 1:
                    ai_service = CodingChatAI()
                    session.title = ai_service.generate_session_title(user_message)
                    session.save()
                
            
                conversation_history = session.messages.order_by('created_at')
                
            
                ai_service = CodingChatAI()
                ai_result = ai_service.get_response(user_message, conversation_history)
                
                
                assistant_msg = ChatMessage.objects.create(
                    session=session,
                    message_type='assistant',
                    content=ai_result['response'],
                    tokens_used=ai_result.get('tokens_used'),
                    response_time=ai_result.get('response_time')
                )
                
                return Response({
                    'user_message': ChatMessageSerializer(user_msg).data,
                    'assistant_message': ChatMessageSerializer(assistant_msg).data,
                    'session_id': str(session.id),
                    'success': ai_result['success']
                })
        
        except Exception as e:
            logger.error(f"Error in quick_chat: {str(e)}")
            return Response(
                {'error': 'Failed to process message'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SessionManagementView(views.APIView):
    """Manage user sessions"""
    
    def get(self, request):
        """Get session information"""
        if not request.session.session_key:
            request.session.create()
        
        # Get session stats
        chat_sessions = ChatSession.objects.filter(
            session_key=request.session.session_key
        )
        
        total_messages = ChatMessage.objects.filter(
            session__session_key=request.session.session_key
        ).count()
        
        session_data = {
            'session_key': request.session.session_key,
            'chat_sessions_count': chat_sessions.count(),
            'total_messages': total_messages,
            'created_reviews_count': total_messages,  # For frontend compatibility
            'last_activity': request.session.get('last_activity', timezone.now().isoformat()),
        }
        
        return Response(session_data)
    
    def delete(self, request):
        """Clear session and all associated chats"""
        session_key = request.session.session_key
        
        if session_key:
            # Delete all chat sessions for this user session
            ChatSession.objects.filter(session_key=session_key).delete()
        
        request.session.flush()
        return Response({'message': 'Session cleared successfully'})

class StatsView(views.APIView):
    """Get system statistics"""
    
    def get(self, request):
        """Get overall stats"""
        
        session_key = request.session.session_key
        user_sessions = 0
        user_messages = 0
        
        if session_key:
            user_sessions = ChatSession.objects.filter(session_key=session_key).count()
            user_messages = ChatMessage.objects.filter(
                session__session_key=session_key
            ).count()
    
        total_sessions = ChatSession.objects.count()
        total_messages = ChatMessage.objects.count()
        
        stats = {
            'total_reviews': total_sessions, 
            'completed_reviews': total_sessions,
            'analyzing_reviews': 0,
            'recent_activity': {
                'reviews_last_30_days': user_sessions,
            },
            'user_session_stats': {
                'chat_sessions': user_sessions,
                'total_messages': user_messages,
            }
        }
        
        return Response(stats)

class HealthCheckView(views.APIView):
    
    def get(self, request):

        try:
    
            ChatSession.objects.count()
            
            
            ai_service = CodingChatAI()
            
            return Response({
                'status': 'healthy',
                'timestamp': timezone.now(),
                'services': {
                    'database': True,
                    'openai': hasattr(ai_service, 'get_response'),
                }
            })
        except Exception as e:
            return Response({
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': timezone.now(),
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)