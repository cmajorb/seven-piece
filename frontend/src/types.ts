export type Piece = {
    character: string;
    player: number;
    health: number;
    description: string;
    location: number[];
    range: number;
    attack: number;
    image: string;
    id: number;
  };

  export type Player = {
    number: number;
    session: string;
    score: number;
  };

export type ColorScheme = {
    tile_colors: ColorConstants,
    start_tiles: string[]
}
export type Map = {
    start_tiles: [[number[]]],
    data: [number[]],
    color_scheme: ColorScheme
};

export type GameState = {
    session: string;
    state: string;
    map: Map;
    turn_count: number;
    objectives: string[];
    pieces: Piece[];
    players: Player[];
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