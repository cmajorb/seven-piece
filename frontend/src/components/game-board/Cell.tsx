import { Card, useTheme } from '@mui/material';
import { Piece, ColorScheme, CellStatus } from '../../types';
import checkSameLocation from '../../utils/checkSameLocation';
import GetBorderColor from '../../utils/getBorderColor';
import getPiece from '../../utils/getPiece';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from '../misc/PNGImages';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  selected: boolean,
  selected_piece_actions: number[][] | undefined,
  cell_status: CellStatus,
  pieces: Piece[],
  color_scheme: ColorScheme,
  this_player_id: number,
  updateSelected: any,
};

// ----------------------------------------------------------------------

export default function Cell({ location, selected, selected_piece_actions, cell_status, pieces, color_scheme, this_player_id, updateSelected }: Props) {
  
  const theme = useTheme();
  const piece: Piece | undefined = getPiece(location, pieces);

  function isValidPieceMove () {
    let is_valid = false;
    if (selected_piece_actions && selected_piece_actions.length > 0) {
      for (let index in selected_piece_actions) {
        if (checkSameLocation(location, selected_piece_actions[index])) { is_valid = true; break };
      }
    }
    return is_valid;
  }


  return (
    <Card
      style={{ justifyContent: "center", alignItems: "flex-start", display: "flex" }}
      sx={{ width: 72, height: 72, border: 2,
        borderColor: theme.palette.common.black,
        ...( isValidPieceMove() && { borderColor: (GetBorderColor(color_scheme, this_player_id, true)) }),
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: '1000%',
        opacity: cell_status.is_empty ? '0%' : '100%',
        '&:hover': { cursor: cell_status.is_empty ? null : 'pointer' },
      }}
      onClick={() => { updateSelected(location, piece, false) }}
      onContextMenu={() => { console.log("RIGHT CLICKED!", location, piece) }}
    >
      { cell_status.contains_wall &&
        <WallImg/>
      }
      { piece && cell_status.contains_objective && cell_status.contains_piece &&
        <ObjectiveAndPieceImg
          player_id={piece.player}
          piece_name={piece.name}
          health={piece.current_stats.health}
          selected={selected}
        />
      }
      { cell_status.contains_objective && !cell_status.contains_piece &&
        <ObjectiveImg player_id={cell_status.objective_owner!} width={43} height={54} sx={{ pt: 1.25 }}/>
      }
      { piece && cell_status.contains_piece && !cell_status.contains_objective &&
        <PieceImg
          player_id={piece.player}
          piece_name={getPiece(location, pieces) ? getPiece(location, pieces)!.name : ''}
          health={piece.current_stats.health}
          on_board={true}
          selected={selected}
        />
      }
    </Card>
  );
}