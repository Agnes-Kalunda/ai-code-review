
from django.contrib import admin
from .models import ChatSession, ChatMessage

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'session_key', 'message_count', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['title', 'session_key', 'id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Session Info', {
            'fields': ('id', 'session_key', 'title')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = 'Messages'

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'message_type', 'content_preview', 'tokens_used', 'response_time', 'created_at']
    list_filter = ['message_type', 'created_at']
    search_fields = ['content', 'session__title']
    readonly_fields = ['id', 'created_at', 'tokens_used', 'response_time']
    
    fieldsets = (
        ('Message Info', {
            'fields': ('session', 'message_type', 'content')
        }),
        ('Metadata', {
            'fields': ('tokens_used', 'response_time', 'created_at'),
            'classes': ('collapse',)
        })
    )
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'