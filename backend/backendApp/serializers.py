
from rest_framework import serializers
from .models import ChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message_type', 'content', 'created_at', 'tokens_used', 'response_time']
        read_only_fields = ['id', 'created_at', 'tokens_used', 'response_time']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'created_at', 'updated_at', 'messages', 'message_count']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        return obj.messages.count()

class ChatSessionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing sessions"""
    message_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'created_at', 'updated_at', 'message_count', 'last_message']
    
    def get_message_count(self, obj):
        return obj.messages.count()
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'content': last_msg.content[:100] + '...' if len(last_msg.content) > 100 else last_msg.content,
                'message_type': last_msg.message_type,
                'created_at': last_msg.created_at
            }
        return None

class SendMessageSerializer(serializers.Serializer):
    """Serializer for sending messages"""
    message = serializers.CharField(max_length=4000)
    session_id = serializers.UUIDField(required=False, allow_null=True)
    
    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Message cannot be empty")
        return value.strip()