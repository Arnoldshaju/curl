from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LinkViewSet, PublicCreateLinkView, RedirectView, HealthCheckView

router = DefaultRouter()
router.register(r'links', LinkViewSet, basename='link')

urlpatterns = [
    path('', include(router.urls)),
    path('public-create/', PublicCreateLinkView.as_view(), name='public-create-link'),
]
