from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views
from game import views

urlpatterns = [
    # path('', admin.site.urls),
    path('admin/', admin.site.urls),
    path('stats/', views.index),
    # path('get_pending_info/', views.get_pending_info, name='get_pending_info'),
    # path('get_admin_tokens/', views.get_admin_tokens),
    # path('register/', views.register),
    path('current_user/', views.current_user),
    path('current_user_stats/', views.current_user_stats),
    path('get_leaderboard/', views.get_leaderboard),
    path('register/', views.register),
    path('get_maps/', views.get_maps),
    path('get_characters/', views.get_characters),
    path('token_obtain/', jwt_views.TokenObtainPairView.as_view()),
    path('token_refresh/', jwt_views.TokenRefreshView.as_view()),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
