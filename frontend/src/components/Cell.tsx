import { Card } from '@mui/material';
import { Piece, ColorScheme, CellStatus } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import getPiece from '../utils/getPiece';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from './PNGImages';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  selected: boolean,
  cell_status: CellStatus,
  pieces: Piece[],
  color_scheme: ColorScheme,
  this_player_id: number,
  updateSelected: any,
};

// ----------------------------------------------------------------------

export default function Cell({ location, selected, cell_status, pieces, color_scheme, this_player_id, updateSelected }: Props) {
  
  const piece: Piece | undefined = getPiece(location, pieces);

  return (
    <Card
      style={{ justifyContent: "center", alignItems: "flex-start", display: "flex" }}
      sx={{ width: 72, height: 72, border: 2,
        borderColor: (GetBorderColor(color_scheme, (piece ? this_player_id : -1), selected)),
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
          health={piece!.current_stats.health}
        />
      }
      { cell_status.contains_objective && !cell_status.contains_piece &&
        <ObjectiveImg player_id={cell_status.objective_owner!} width={50} height={50} sx={{ pt: 1.25 }}/>
      }
      { cell_status.contains_piece && !cell_status.contains_objective &&
        <PieceImg
          player_id={piece!.player}
          piece_name={getPiece(location, pieces) ? getPiece(location, pieces)!.character : ''}
          health={piece!.current_stats.health}
          on_board={true}
        />
      }
    </Card>
  );
}