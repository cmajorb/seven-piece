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
from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from game import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sevenpiece.settings')

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent
sys.path.append(str(ROOT_DIR / "sevenpiece"))

application = ProtocolTypeRouter({
    'channel': ChannelNameRouter({
        'background-tasks': consumers.BackgroundTaskConsumer.as_asgi(),
    }),
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path(r"^game/(?P<game_id>.+)$", consumers.GameConsumer.as_asgi()),
                re_path(r"^menu$", consumers.MenuConsumer.as_asgi()),
            ])
        )
    ),
})