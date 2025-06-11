from django.db import models
import uuid

class CodeReview(models.Model):
    ANALYSIS_STATUS = [("pending", "Pending"),
                       ("analyzing", "Analyzing"),
                       ("completed", "Completed"),
                       ("failed", "Failed")
                       ]
    
    SUBMISSION_TYPE = [("file", "File Upload"),
                       ("text", "Text Input")
                       
                       ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission_type = models.CharField(max_length=10, choices=SUBMISSION_TYPE)
    uploaded_file = models.FileField(upload_to=".code_files/", null=True, blank=True)
    original_filename = models.CharField(max_length=225, null=True, blank=True)
    
    code_content = models.TextField(blank=True, null=True,)
    status = models.CharField(max_length=20, choices=ANALYSIS_STATUS, default='pending')
    ai_analysis = models.JSONField(blank=True, null=True,)
    analysis_summary = models.TextField(null=True, blank=True)
    
    static_analysis = models.JSONField(blank=True, null=True)
    
    # Metadata
    file_size = models.PositiveIntegerField(null=True, blank=True)  
    lines_of_code = models.PositiveIntegerField(null=True, blank=True)
    language = models.CharField(max_length=50, default='python')
    
   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    analysis_completed_at = models.DateTimeField(null=True, blank=True)
    

    error_message = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ["created_at"]
        
    def __str__(self):
        if self.submission_type == "file" and self.original_filename:
            return f"File: {self.original_filename} - {self.status}"
        return f"Text submission - {self.status}"
    
    @property
    def get_code_content(self):

        if self.submission_type == 'file' and self.uploaded_file:
            try:
                with open(self.uploaded_file.path, 'r', encoding='utf-8') as file:
                    return file.read()
            except Exception:
                return None
        return self.code_content
    
class AnalysisMetrics(models.Model):
    
    review = models.OneToOneField(CodeReview, on_delete=models.CASCADE, related_name='metrics')
    
    
    complexity_score = models.FloatField(null=True, blank=True)
    maintainability_score = models.FloatField(null=True, blank=True)
    security_score = models.FloatField(null=True, blank=True)
    performance_score = models.FloatField(null=True, blank=True)

    critical_issues = models.PositiveIntegerField(default=0)
    major_issues = models.PositiveIntegerField(default=0)
    minor_issues = models.PositiveIntegerField(default=0)
    suggestions = models.PositiveIntegerField(default=0)
    

    pylint_score = models.FloatField(null=True, blank=True)
    flake8_violations = models.PositiveIntegerField(default=0)
    security_vulnerabilities = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Metrics for {self.review}"
    
    
class ReviewFeedback(models.Model):
    
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('major', 'Major'),
        ('minor', 'Minor'),
        ('suggestion', 'Suggestion'),
    ]
    
    CATEGORY_CHOICES = [
        ('bug', 'Potential Bug'),
        ('security', 'Security Issue'),
        ('performance', 'Performance'),
        ('style', 'Code Style'),
        ('structure', 'Code Structure'),
        ('best_practice', 'Best Practice'),
        ('documentation', 'Documentation'),
    ]
    
    review = models.ForeignKey(CodeReview, on_delete=models.CASCADE, related_name='feedback_items')
    
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    suggestion = models.TextField(null=True, blank=True)
    
    line_number = models.PositiveIntegerField(null=True, blank=True)
    column_number = models.PositiveIntegerField(null=True, blank=True)
    code_snippet = models.TextField(null=True, blank=True)
    

    confidence_score = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['severity', '-created_at']
    
    def __str__(self):
        return f"{self.severity}: {self.title}"




