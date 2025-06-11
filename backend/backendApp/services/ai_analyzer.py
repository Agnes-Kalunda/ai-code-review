import openai
from django.conf import settings
import json
import ast
import pylint.lint
import tempfile
import os
from io import StringIO
import sys
from contextlib import redirect_stderr, redirect_stdout
import re

class AICodeAnalyzer:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        
    def analyze_code(self, code_content, language='python'):
        """Main method to analyze code using both static analysis and AI"""
        results = {
            'static_analysis': {},
            'ai_analysis': {},
            'metrics': {},
            'feedback_items': []
        }
        
        try:
            
            if language.lower() == 'python':
                results['static_analysis'] = self._python_static_analysis(code_content)
            
            
            results['ai_analysis'] = self._ai_analysis(code_content, language)
            
    
            results['metrics'] = self._calculate_metrics(code_content, results)
            
        
            results['feedback_items'] = self._generate_feedback_items(results)
            
        except Exception as e:
            results['error'] = str(e)
            
        return results
    
    def _python_static_analysis(self, code_content):
        """Perform static analysis on Python code"""
        analysis_results = {
            'pylint': {},
            'syntax_check': {},
            'complexity': {},
            'security': []
        }
        
        try:
        
            try:
                ast.parse(code_content)
                analysis_results['syntax_check'] = {'valid': True, 'errors': []}
            except SyntaxError as e:
                analysis_results['syntax_check'] = {
                    'valid': False,
                    'errors': [{'line': e.lineno, 'message': str(e)}]
                }
            
            
            analysis_results['pylint'] = self._run_pylint(code_content)
            
    
            analysis_results['complexity'] = self._analyze_complexity(code_content)
            
            
            analysis_results['security'] = self._basic_security_check(code_content)
            
        except Exception as e:
            analysis_results['error'] = str(e)
            
        return analysis_results
    
    def _run_pylint(self, code_content):
        """Run pylint on the code"""
        try:
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
                temp_file.write(code_content)
                temp_file_path = temp_file.name
            
            
            pylint_output = StringIO()
            
            try:
                with redirect_stdout(pylint_output), redirect_stderr(pylint_output):
                    pylint.lint.Run([temp_file_path, '--output-format=json'], exit=False)
            except SystemExit:
                pass
            
        
            os.unlink(temp_file_path)
            
            
            output_str = pylint_output.getvalue()
            try:
                pylint_results = json.loads(output_str)
                return {
                    'score': 10.0,  # Default score
                    'violations': pylint_results if isinstance(pylint_results, list) else [],
                    'raw_output': output_str
                }
            except json.JSONDecodeError:
                return {
                    'score': 10.0,
                    'violations': [],
                    'raw_output': output_str
                }
                
        except Exception as e:
            return {'error': str(e)}
    
    def _analyze_complexity(self, code_content):
        """Analyze code complexity"""
        try:
            tree = ast.parse(code_content)
            
            complexity_info = {
                'functions': 0,
                'classes': 0,
                'lines': len(code_content.splitlines()),
                'max_nesting_depth': 0,
                'cyclomatic_complexity': 1 
            }
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    complexity_info['functions'] += 1
                elif isinstance(node, ast.ClassDef):
                    complexity_info['classes'] += 1
                elif isinstance(node, (ast.If, ast.While, ast.For, ast.Try)):
                    complexity_info['cyclomatic_complexity'] += 1
            
            return complexity_info
            
        except Exception as e:
            return {'error': str(e)}
    
    def _basic_security_check(self, code_content):
        """Basic security pattern checking"""
        security_issues = []
        
        
        patterns = [
            (r'eval\s*\(', 'Use of eval() can be dangerous'),
            (r'exec\s*\(', 'Use of exec() can be dangerous'),
            (r'__import__\s*\(', 'Dynamic imports should be reviewed'),
            (r'input\s*\(.*\)', 'input() without validation can be risky'),
            (r'pickle\.loads?\s*\(', 'Pickle can execute arbitrary code'),
            (r'subprocess\.(call|run|Popen)', 'Subprocess calls should be reviewed'),
            (r'os\.system\s*\(', 'os.system() can be dangerous'),
        ]
        
        lines = code_content.splitlines()
        for line_num, line in enumerate(lines, 1):
            for pattern, message in patterns:
                if re.search(pattern, line):
                    security_issues.append({
                        'line': line_num,
                        'message': message,
                        'code': line.strip()
                    })
        
        return security_issues
    
    def _ai_analysis(self, code_content, language):
        """Use OpenAI to analyze the code"""
        prompt = self._create_analysis_prompt(code_content, language)
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4o-mini",  
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert code reviewer. Analyze the provided code and return your findings in a structured JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            ai_response = response.choices[0].message.content
            
        
            try:
                return json.loads(ai_response)
            except json.JSONDecodeError:
                return {
                    'summary': ai_response,
                    'structured_analysis': False
                }
                
        except Exception as e:
            return {'error': str(e)}
    
    def _create_analysis_prompt(self, code_content, language):
        """Create a structured prompt for AI analysis"""
        return f"""
Please analyze the following {language} code and provide a comprehensive review.

CODE:
```{language}
{code_content}
```

Please provide your analysis in this JSON format:
{{
    "overall_quality_score": 8.5,
    "summary": "Brief overall assessment",
    "strengths": ["List of code strengths"],
    "issues": [
        {{
            "severity": "critical|major|minor",
            "category": "bug|security|performance|style|structure|best_practice|documentation",
            "title": "Issue title",
            "description": "Detailed description",
            "line_number": 10,
            "suggestion": "How to fix it",
            "confidence": 0.9
        }}
    ],
    "suggestions": [
        {{
            "category": "performance|structure|best_practice",
            "title": "Suggestion title",
            "description": "Detailed suggestion",
            "impact": "high|medium|low"
        }}
    ],
    "code_metrics": {{
        "readability_score": 8.0,
        "maintainability_score": 7.5,
        "performance_score": 8.5,
        "security_score": 9.0
    }}
}}

Focus on:
1. Code quality and best practices
2. Potential bugs or logical errors
3. Security vulnerabilities
4. Performance optimizations
5. Code structure and readability
6. Documentation quality
"""
    
    def _calculate_metrics(self, code_content, analysis_results):
        """Calculate overall metrics from analysis results"""
        metrics = {
            'complexity_score': 7.0,
            'maintainability_score': 7.0,
            'security_score': 8.0,
            'performance_score': 7.0,
            'critical_issues': 0,
            'major_issues': 0,
            'minor_issues': 0,
            'suggestions': 0
        }
        
        
        if 'ai_analysis' in analysis_results and 'code_metrics' in analysis_results['ai_analysis']:
            ai_metrics = analysis_results['ai_analysis']['code_metrics']
            metrics.update({
                'maintainability_score': ai_metrics.get('maintainability_score', 7.0),
                'performance_score': ai_metrics.get('performance_score', 7.0),
                'security_score': ai_metrics.get('security_score', 8.0)
            })
        
        
        if 'ai_analysis' in analysis_results and 'issues' in analysis_results['ai_analysis']:
            for issue in analysis_results['ai_analysis']['issues']:
                severity = issue.get('severity', 'minor')
                if severity == 'critical':
                    metrics['critical_issues'] += 1
                elif severity == 'major':
                    metrics['major_issues'] += 1
                else:
                    metrics['minor_issues'] += 1
        
        
        if 'ai_analysis' in analysis_results and 'suggestions' in analysis_results['ai_analysis']:
            metrics['suggestions'] = len(analysis_results['ai_analysis']['suggestions'])
        
    
        if 'static_analysis' in analysis_results and 'complexity' in analysis_results['static_analysis']:
            complexity = analysis_results['static_analysis']['complexity']
            if 'cyclomatic_complexity' in complexity:
            
                cc = complexity['cyclomatic_complexity']
                if cc <= 5:
                    metrics['complexity_score'] = 9.0
                elif cc <= 10:
                    metrics['complexity_score'] = 7.0
                elif cc <= 15:
                    metrics['complexity_score'] = 5.0
                else:
                    metrics['complexity_score'] = 3.0
        
        return metrics
    
    def _generate_feedback_items(self, analysis_results):
        """Generate structured feedback items"""
        feedback_items = []
        
    
        if 'ai_analysis' in analysis_results and 'issues' in analysis_results['ai_analysis']:
            for issue in analysis_results['ai_analysis']['issues']:
                feedback_items.append({
                    'severity': issue.get('severity', 'minor'),
                    'category': issue.get('category', 'style'),
                    'title': issue.get('title', 'Code Issue'),
                    'description': issue.get('description', ''),
                    'suggestion': issue.get('suggestion', ''),
                    'line_number': issue.get('line_number'),
                    'confidence_score': issue.get('confidence', 0.8)
                })
        
    
        if 'ai_analysis' in analysis_results and 'suggestions' in analysis_results['ai_analysis']:
            for suggestion in analysis_results['ai_analysis']['suggestions']:
                feedback_items.append({
                    'severity': 'suggestion',
                    'category': suggestion.get('category', 'best_practice'),
                    'title': suggestion.get('title', 'Improvement Suggestion'),
                    'description': suggestion.get('description', ''),
                    'suggestion': suggestion.get('description', ''),
                    'confidence_score': 0.8
                })
        
        
        if 'static_analysis' in analysis_results:
            static = analysis_results['static_analysis']
            
            
            if 'syntax_check' in static and not static['syntax_check'].get('valid', True):
                for error in static['syntax_check'].get('errors', []):
                    feedback_items.append({
                        'severity': 'critical',
                        'category': 'bug',
                        'title': 'Syntax Error',
                        'description': error.get('message', 'Syntax error detected'),
                        'line_number': error.get('line'),
                        'confidence_score': 1.0
                    })
            
        
            if 'security' in static:
                for security_issue in static['security']:
                    feedback_items.append({
                        'severity': 'major',
                        'category': 'security',
                        'title': 'Security Concern',
                        'description': security_issue.get('message', 'Security issue detected'),
                        'line_number': security_issue.get('line'),
                        'code_snippet': security_issue.get('code'),
                        'confidence_score': 0.9
                    })
        
        return feedback_items