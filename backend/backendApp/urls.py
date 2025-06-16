
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChatSessionViewSet,
    QuickChatView,
    SessionManagementView,
    StatsView,
    HealthCheckView
)

app_name = 'backendApp'

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='chatsession')

urlpatterns = [

    path('', include(router.urls)),
    
    
    path('chat/', QuickChatView.as_view(), name='quick-chat'),
    

    path('session/', SessionManagementView.as_view(), name='session-management'),
    
    
    path('stats/', StatsView.as_view(), name='stats'),
    
    
    path('health/', HealthCheckView.as_view(), name='health-check'),
]

# Available endpoints:
# POST   /api/chat/                       - Send message and get AI response
# GET    /api/sessions/                   - List user's chat sessions  
# POST   /api/sessions/                   - Create new chat session
# GET    /api/sessions/{id}/              - Get specific session with messages
# POST   /api/sessions/{id}/send_message/ - Send message to specific session
# DELETE /api/sessions/{id}/              - Delete session
# GET    /api/session/                    - Get session info
# DELETE /api/session/                    - Clear session
# GET    /api/stats/                      - Get statistics
# GET    /api/health/                     - Health check