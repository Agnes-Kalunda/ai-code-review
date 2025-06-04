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






