import { Card } from '@mui/material';
import { Constants, Piece, ColorScheme } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import getPiece from '../utils/getPiece';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from './getPNGImages';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  selected: boolean,
  cell_status: number,
  pieces: Piece[],
  updateSelected: any,
  color_scheme: ColorScheme
};

// ----------------------------------------------------------------------

export default function Cell({ location, selected, cell_status, pieces, updateSelected, color_scheme }: Props) {
  
  const constants: Constants = require('../testing/constants.json');
  const contains_objective: boolean = (cell_status & constants.objective) === constants.objective;
  const contains_piece: boolean = (cell_status & constants.player) === constants.player;
  const contains_wall: boolean = (cell_status & constants.wall) === constants.wall;
  const is_empty: boolean = (cell_status & constants.empty) === constants.empty ;
  const piece: Piece | undefined = getPiece(location, pieces);

  return (
    <Card
      style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
      sx={{ width: 58, height: 58, border: 2,
        borderColor: (
          GetBorderColor(
            (contains_objective || contains_piece),
            color_scheme,
            (piece ? piece.player : -1),
            selected
          )
        ),
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: '1000%',
        opacity: is_empty ? '0%' : '100%',
        '&:hover': { cursor: is_empty ? null : 'pointer' },
      }}
      onClick={() => { updateSelected(location, piece, cell_status) }}
      onContextMenu={() => { console.log("RIGHT CLICKED!", location, piece) }}
    >
      { contains_wall &&
        <WallImg/>
      }
      { contains_objective && contains_piece &&
        <ObjectiveAndPieceImg
          player_id={piece!.player}
          piece_name={piece!.character}
          start_tiles={color_scheme.start_tiles}
        />
      }
      { contains_objective && !contains_piece &&
        <ObjectiveImg player_id={-1}/>
      }
      { contains_piece && !contains_objective &&
        <PieceImg
          piece_name={getPiece(location, pieces) ? getPiece(location, pieces)!.character : ''}
          on_board={true}
        />
      }
    </Card>
  );
}