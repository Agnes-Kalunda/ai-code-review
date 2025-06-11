from django.contrib import admin
from .models import CodeReview, AnalysisMetrics, ReviewFeedback

@admin.register(CodeReview)
class CodeReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'submission_type', 'original_filename', 'status', 'language', 'created_at']
    list_filter = ['status', 'submission_type', 'language', 'created_at']
    search_fields = ['original_filename', 'id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'submission_type', 'language', 'status')
        }),
        ('File Upload', {
            'fields': ('uploaded_file', 'original_filename', 'file_size'),
            'classes': ('collapse',)
        }),
        ('Text Content', {
            'fields': ('code_content',),
            'classes': ('collapse',)
        }),
        ('Analysis Results', {
            'fields': ('ai_analysis', 'static_analysis', 'analysis_summary'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('lines_of_code', 'created_at', 'updated_at', 'analysis_completed_at'),
            'classes': ('collapse',)
        }),
        ('Errors', {
            'fields': ('error_message',),
            'classes': ('collapse',)
        })
    )

@admin.register(AnalysisMetrics)
class AnalysisMetricsAdmin(admin.ModelAdmin):
    list_display = ['review', 'complexity_score', 'security_score', 'critical_issues', 'major_issues']
    list_filter = ['created_at']
    
@admin.register(ReviewFeedback)
class ReviewFeedbackAdmin(admin.ModelAdmin):
    list_display = ['review', 'severity', 'category', 'title', 'line_number', 'created_at']
    list_filter = ['severity', 'category', 'created_at']
    search_fields = ['title', 'description']
