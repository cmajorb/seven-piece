export type Piece = {
    name: string;
    player: number;
    description: string;
    location: number[];
    image: string;
    id: number;
    current_stats: Stats;
    start_stats: Stats;
    default_stats: Stats;
  };  

  export type Score = {
    objectives: number;
    kills: number;
    total: number;
  };
  
  export type Player = {
    number: number;
    session: string;
    score: Score;
    is_turn: boolean;
  };

export type ColorScheme = {
    tile_colors: ColorConstants;
    start_tiles: string[];
}
export type Map = {
    start_tiles: [[number[]]];
    data: [number[]];
    color_scheme: ColorScheme;
};

export type Stats = {
    health: number;
    speed: number;
    attack: number;
    attack_range_max: number;
    attack_range_min: number;
    special: string;
    special_range: number;
};

export type GameState = {
    session: string;
    state: string;
    map: Map;
    turn_count: number;
    objectives: string[];
    pieces: Piece[];
    players: Player[];
    score_to_win: number;
    winner: number;
    allowed_pieces: number;
};

export type Constants = {
    empty: number;
    normal: number;
    wall: number;
    objective: number;
    player: number;
};

export type ColorConstants = {
    empty: string;
    normal: string;
    wall: string;
    objective: string;
    player: string;
};

export type CellStatus = {
    is_empty: boolean;
    contains_wall: boolean;
    contains_piece: boolean;
    contains_objective: boolean;
    objective_owner: number | undefined;
};

export type PieceActions = 'move' | 'attack';
export type WebSocketStatus = 'Connecting' | 'Open' | 'Closing' | 'Closed' | 'Uninstantiated';