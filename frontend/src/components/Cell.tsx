import { Card } from '@mui/material';
import { Piece, ColorScheme, CellStatus } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import getPiece from '../utils/getPiece';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from './getPNGImages';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  selected: boolean,
  cell_status: CellStatus,
  pieces: Piece[],
  updateSelected: any,
  color_scheme: ColorScheme
};

// ----------------------------------------------------------------------

export default function Cell({ location, selected, cell_status, pieces, updateSelected, color_scheme }: Props) {
  
  const piece: Piece | undefined = getPiece(location, pieces);

  return (
    <Card
      style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
      sx={{ width: 58, height: 58, border: 2,
        borderColor: (
          GetBorderColor(
            (cell_status.contains_objective || cell_status.contains_piece),
            color_scheme,
            (piece ? piece.player : -1),
            selected
          )
        ),
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: '1000%',
        opacity: cell_status.is_empty ? '0%' : '100%',
        '&:hover': { cursor: cell_status.is_empty ? null : 'pointer' },
      }}
      onClick={() => { updateSelected(location, piece, cell_status) }}
      onContextMenu={() => { console.log("RIGHT CLICKED!", location, piece) }}
    >
      { cell_status.contains_wall &&
        <WallImg/>
      }
      { cell_status.contains_objective && cell_status.contains_piece &&
        <ObjectiveAndPieceImg
          player_id={piece!.player}
          piece_name={piece!.character}
          start_tiles={color_scheme.start_tiles}
        />
      }
      { cell_status.contains_objective && !cell_status.contains_piece &&
        <ObjectiveImg player_id={-1}/>
      }
      { cell_status.contains_piece && !cell_status.contains_objective &&
        <PieceImg
          piece_name={getPiece(location, pieces) ? getPiece(location, pieces)!.character : ''}
          on_board={true}
        />
      }
    </Card>
  );
}