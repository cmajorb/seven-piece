class IllegalMoveError(Exception):
    def __init__(self, message="This is not a legal move"):
        self.message = message
        super().__init__(self.message)

class GameDoesNotExist(Exception):
    def __init__(self, message="This game session does not exist"):
        self.message = message
        super().__init__(self.message)

class IllegalPieceSelection(Exception):
    def __init__(self, message="This combination is not legal"):
        self.message = message
        super().__init__(self.message)

class JoinGameError(Exception):
    def __init__(self, message="Can't join game"):
        self.message = message
        super().__init__(self.message)
        