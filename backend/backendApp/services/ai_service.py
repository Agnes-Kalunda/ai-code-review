
import openai
from django.conf import settings
import time
import logging

logger = logging.getLogger(__name__)

class CodingChatAI:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        
    def get_response(self, user_message, conversation_history=None):
        """
        Get AI response for coding-related questions
        """
        try:
            start_time = time.time()
            
            
            messages = self._prepare_messages(user_message, conversation_history)
            
            
            response = openai.chat.completions.create(
                model="gpt-4o-mini",  
                messages=messages,
                temperature=0.3,
                max_tokens=2000,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            response_time = time.time() - start_time
            ai_response = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if response.usage else None
            
            return {
                'response': ai_response,
                'tokens_used': tokens_used,
                'response_time': response_time,
                'success': True
            }
            
        except openai.APIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return {
                'response': "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment.",
                'error': str(e),
                'success': False
            }
        except Exception as e:
            logger.error(f"Unexpected error in AI service: {str(e)}")
            return {
                'response': "I encountered an unexpected error. Please try again.",
                'error': str(e),
                'success': False
            }
    
    def _prepare_messages(self, user_message, conversation_history=None):

        
        
        system_prompt = """You are an expert programming assistant. Your role is to help with:

- Code review and debugging
- Programming concepts and best practices
- Algorithm and data structure questions
- Framework and library usage
- Code optimization and performance
- Architecture and design patterns
- Troubleshooting technical issues

Guidelines:
- Provide clear, practical coding solutions
- Include code examples when helpful
- Explain your reasoning
- Ask clarifying questions when needed
- Focus on best practices and clean code
- Be concise but thorough

If asked about non-programming topics, politely redirect the conversation back to coding and development topics."""

        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        
        if conversation_history:
            
            history_list = list(conversation_history)
            recent_history = history_list[-10:] if len(history_list) > 10 else history_list
            
            for msg in recent_history:
                role = "user" if msg.message_type == "user" else "assistant"
                messages.append({
                    "role": role,
                    "content": msg.content
                })
        
    
        messages.append({
            "role": "user", 
            "content": user_message
        })
        
        return messages
    
    def is_coding_related(self, message):
        coding_keywords = [
            'code', 'programming', 'function', 'variable', 'class', 'method',
            'algorithm', 'debug', 'error', 'bug', 'python', 'javascript', 
            'java', 'cpp', 'c++', 'html', 'css', 'sql', 'database',
            'api', 'framework', 'library', 'import', 'export', 'syntax',
            'loop', 'array', 'object', 'string', 'integer', 'boolean',
            'if', 'else', 'while', 'for', 'try', 'catch', 'exception'
        ]
        
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in coding_keywords)
    
    def generate_session_title(self, first_message):
        """Generate a title for the chat session based on first message"""
        try:
            
            words = first_message.split()[:8]  
            title = ' '.join(words)
            if len(title) > 50:
                title = title[:47] + "..."
            return title or "Coding Chat"
        except:
            return "Coding Chat"