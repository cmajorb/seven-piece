from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import CustomObtainAuthTokenView

urlpatterns = [
    path('', admin.site.urls),
    path('admin/', admin.site.urls),
    path('token_obtain/', CustomObtainAuthTokenView.as_view(), name='token_obtain'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)