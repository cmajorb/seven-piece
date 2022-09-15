import { Card } from '@mui/material';
import { Constants, Piece, Map } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import getPiece from '../utils/getPiece';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from './getPNGImages';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  selected: boolean,
  cell_status: number[],
  pieces: Piece[],
  constants: Constants,
  map: Map,
  updateSelected: any,
};

// ----------------------------------------------------------------------

export default function Cell({ location, selected, cell_status, pieces, constants, map, updateSelected }: Props) {
  
  const is_wall: boolean = cell_status.includes(constants.wall as number);
  const contains_objective: boolean = cell_status.includes(constants.objective as number) && !(cell_status.includes(constants.player as number));
  const contains_piece: boolean = cell_status.includes(constants.player as number) && !(cell_status.includes(constants.objective as number));
  const contains_objective_and_piece: boolean = cell_status.includes(constants.objective as number) && cell_status.includes(constants.player as number);
  const piece: Piece | undefined = getPiece(location, pieces);

  return (
    <Card
      style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
      sx={{ width: 58, height: 58, border: 2,
        borderColor: (
          GetBorderColor(
            (contains_objective || contains_piece),
            map.color_scheme,
            (piece ? piece.player : -1),
            selected
          )
        ),
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: '1000%',
        '&:hover': { cursor: 'pointer' },
      }}
      onClick={() => { updateSelected(location) }}
    >
      { is_wall &&
        <WallImg/>
      }
      { contains_objective_and_piece &&
        <ObjectiveAndPieceImg
          player_id={piece!.player}
          piece_name={piece!.character}
          start_tiles={map.color_scheme.start_tiles}
        />
      }
      { contains_objective &&
        <ObjectiveImg player_id={-1}/>
      }
      { contains_piece &&
        <PieceImg
          piece_name={getPiece(location, pieces)!.character}
          on_board={true}
        />
      }
    </Card>
  );
}