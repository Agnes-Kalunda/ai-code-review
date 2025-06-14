# Generated by Django 5.2.1 on 2025-06-11 15:39

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnalysisMetrics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('complexity_score', models.FloatField(blank=True, null=True)),
                ('maintainability_score', models.FloatField(blank=True, null=True)),
                ('security_score', models.FloatField(blank=True, null=True)),
                ('performance_score', models.FloatField(blank=True, null=True)),
                ('critical_issues', models.PositiveIntegerField(default=0)),
                ('major_issues', models.PositiveIntegerField(default=0)),
                ('minor_issues', models.PositiveIntegerField(default=0)),
                ('suggestions', models.PositiveIntegerField(default=0)),
                ('pylint_score', models.FloatField(blank=True, null=True)),
                ('flake8_violations', models.PositiveIntegerField(default=0)),
                ('security_vulnerabilities', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='CodeReview',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('submission_type', models.CharField(choices=[('file', 'File Upload'), ('text', 'Text Input')], max_length=10)),
                ('uploaded_file', models.FileField(blank=True, null=True, upload_to='.code_files/')),
                ('original_filename', models.CharField(blank=True, max_length=225, null=True)),
                ('code_content', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('analyzing', 'Analyzing'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=20)),
                ('ai_analysis', models.JSONField(blank=True, null=True)),
                ('analysis_summary', models.TextField(blank=True, null=True)),
                ('static_analysis', models.JSONField(blank=True, null=True)),
                ('file_size', models.PositiveIntegerField(blank=True, null=True)),
                ('lines_of_code', models.PositiveIntegerField(blank=True, null=True)),
                ('language', models.CharField(default='python', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('analysis_completed_at', models.DateTimeField(blank=True, null=True)),
                ('error_message', models.TextField(blank=True, null=True)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='ReviewFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('severity', models.CharField(choices=[('critical', 'Critical'), ('major', 'Major'), ('minor', 'Minor'), ('suggestion', 'Suggestion')], max_length=20)),
                ('category', models.CharField(choices=[('bug', 'Potential Bug'), ('security', 'Security Issue'), ('performance', 'Performance'), ('style', 'Code Style'), ('structure', 'Code Structure'), ('best_practice', 'Best Practice'), ('documentation', 'Documentation')], max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('suggestion', models.TextField(blank=True, null=True)),
                ('line_number', models.PositiveIntegerField(blank=True, null=True)),
                ('column_number', models.PositiveIntegerField(blank=True, null=True)),
                ('code_snippet', models.TextField(blank=True, null=True)),
                ('confidence_score', models.FloatField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('review', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feedback_items', to='backendApp.codereview')),
            ],
            options={
                'ordering': ['severity', '-created_at'],
            },
        ),
        migrations.DeleteModel(
            name='Code',
        ),
        migrations.AddField(
            model_name='analysismetrics',
            name='review',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='metrics', to='backendApp.codereview'),
        ),
    ]
