"""
ASGI config for sevenpiece project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
import sys
from pathlib import Path
from django.core.asgi import get_asgi_application
from config import routing

from channels.routing import ProtocolTypeRouter, URLRouter
from .middleware import TokenAuthMiddleware
# from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sevenpiece.settings')

application = get_asgi_application()


ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent
sys.path.append(str(ROOT_DIR / "sevenpiece"))


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        # "websocket": TokenAuthMiddleware(
        #     URLRouter(routing.websocket_urlpatterns)
        #     ),
        "websocket": URLRouter(routing.websocket_urlpatterns),
    }
)