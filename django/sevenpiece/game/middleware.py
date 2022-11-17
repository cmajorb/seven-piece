from channels.auth import AuthMiddlewareStack
import sevenpiece.settings as settings
from channels.middleware import BaseMiddleware

from rest_framework_simplejwt.backends import TokenBackend 
import logging
logging.basicConfig(level=logging.INFO)

class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope, receive, send):
        header_data = dict(scope["headers"])
        cookie_values = header_data[b'cookie'].decode().split(";")
        jwt_key = ""
        for cookie_value in cookie_values:
            if "jwt_key" in cookie_value:
                jwt_key = cookie_value.split("jwt_key=")[1]
        try:
            valid_data = TokenBackend(algorithm=settings.SIMPLE_JWT["ALGORITHM"],signing_key=settings.SIMPLE_JWT["SIGNING_KEY"]).decode(jwt_key,verify=True)
            scope['user_id'] = valid_data['user_id']
        except Exception as e:
            logging.error("Token error: {}".format(e))
            scope['user_id'] = -1
        return self.inner(scope, receive, send)

def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))