class IllegalMoveError(Exception):
    def __init__(self, message="This is not a legal move"):
        self.message = message
        super().__init__(self.message)