export default function getDisplayTurn (game_state: string, round: number) {
    if ((
        game_state === ('PLACING') ||
        game_state === ('SELECTING') ||
        game_state === ('WAITING')
    )) { return -1 }
    else { return (round + 1) };
  };