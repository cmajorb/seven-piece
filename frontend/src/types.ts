export type Piece = {
    character: string;
    player: number;
    health: number;
    location: number[];
    range: number;
    attack: number;
    image: string;
  };

export type Map = {
    start_tiles: [[number[]]],
    data: [number[]],
    color_scheme: {
        tile_colors: {
            one: string;
            two: string;
            four: string;
            eight: string;
        }
        start_tiles: string[]
    }
};

export type GameState = {
    session: string;
    state: string;
    map: Map;
    turn_count: number;
    objectives: string[];
    pieces: Piece[];
};

export type Constants = {
    empty: number;
    normal: number;
    wall: number;
    objective: number;
    player: number;
};