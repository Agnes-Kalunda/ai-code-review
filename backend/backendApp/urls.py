from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CodeReviewViewSet,
    SessionManagementView,
    HealthCheckView
)

app_name = 'backendApp'


router = DefaultRouter()
router.register(r'reviews', CodeReviewViewSet, basename='codereview')

urlpatterns = [
    
    path('', include(router.urls)),
    
    
    path('session/', SessionManagementView.as_view(), name='session-management'),
    
    
    path('health/', HealthCheckView.as_view(), name='health-check'),
]

# endpoints:
# GET    /api/reviews/                    - List all reviews
# POST   /api/reviews/                    - Create new review
# GET    /api/reviews/{id}/               - Get specific review
# PUT    /api/reviews/{id}/               - Update review
# DELETE /api/reviews/{id}/               - Delete review
# POST   /api/reviews/{id}/analyze/       - Trigger analysis
# GET    /api/reviews/{id}/feedback/      - Get feedback items
# GET    /api/reviews/{id}/metrics/       - Get metrics
# GET    /api/reviews/stats/              - Get overall stats
# POST   /api/reviews/bulk_analyze/       - Bulk analyze reviews
# GET    /api/session/                    - Get session info
# DELETE /api/session/                    - Clear session
# GET    /api/health/                     - Health check