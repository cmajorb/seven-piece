import { Card, useTheme } from '@mui/material';
import { Piece, ColorScheme, CellStatus, GameStatus, AnimationType, AnimationDirection } from '../../types';
import checkSameLocation from '../../utils/checkSameLocation';
import GetBorderColor from '../../utils/getBorderColor';
import getPiece from '../../utils/pieces/getPiece';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from '../misc/PNGImages';
import getBannerDimensions from '../../utils/getBannerDimensions';
import FrozenBox from './FrozenBox';
import getPieceAnimation from '../../utils/pieces/getPieceAnimation';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  cell_size: number,
  selected: boolean,
  selected_piece_actions: number[][] | undefined,
  cell_status: CellStatus,
  pieces: Piece[],
  color_scheme: ColorScheme,
  this_player_id: number,
  current_state: GameStatus,
  start_tiles: [[number[]]],
  updateSelected: any,

  is_turn: boolean,
  animation_initiator: Piece | undefined,
  animation_recipient: Piece | undefined,
  animation_type: AnimationType,
  animation_direction: AnimationDirection,
};

// ----------------------------------------------------------------------

export default function Cell({
  location, cell_size, selected, selected_piece_actions, cell_status, pieces,
  color_scheme, this_player_id, current_state, start_tiles, updateSelected,
  animation_initiator, animation_type, animation_direction, animation_recipient, is_turn
}: Props) {
  
  const theme = useTheme();
  const piece: Piece | undefined = getPiece(location, pieces);

  const banner_dimensions = getBannerDimensions(cell_size);
  const banner_width = banner_dimensions[0];
  const banner_height = banner_dimensions[1];

  const show_opponent_pieces: boolean = (current_state === 'PLACING') ? false : true;

  function isValidPieceMove() {
    let is_valid = false;
    let locations: number[][] = [];
    if (current_state === 'PLAYING') {
      if (selected_piece_actions && selected_piece_actions.length > 0) {
        locations = selected_piece_actions;
      }
    } else if (current_state === 'PLACING') {
      locations = start_tiles[this_player_id];
    }
    for (let index in locations) {
      if (checkSameLocation(location, locations[index])) { is_valid = true; break };
    }
    return is_valid;
  };

  return (
    <Card
      style={{ justifyContent: "center", alignItems: "flex-start", display: "flex" }}
      sx={{ width: cell_size, height: cell_size, border: 2,
        borderColor: theme.palette.common.black,
        ...( isValidPieceMove() && { borderColor: (GetBorderColor(color_scheme, this_player_id, true)) }),
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: '1000%',
        opacity: cell_status.is_empty ? '0%' : '100%',
        '&:hover': { cursor: cell_status.is_empty ? null : 'pointer' },
      }}
      onClick={() => { updateSelected(location, piece, show_opponent_pieces, 'left') }}
      onContextMenu={() => { updateSelected(location, piece, show_opponent_pieces, 'right') }}
    >
      
      { piece && piece.state === 'frozen' && <FrozenBox cell_size={cell_size}/> }

      { cell_status.contains_wall &&
        <WallImg size={cell_size}/>
      }
      { piece && cell_status.contains_objective && cell_status.contains_piece && (show_opponent_pieces || piece.player === this_player_id) &&
        <ObjectiveAndPieceImg
          player_id={piece.player}
          this_player_id={this_player_id}
          piece={piece}
          selected={selected}
          size={cell_size * 0.95}
          animation={getPieceAnimation(piece, animation_initiator, animation_recipient, animation_direction, animation_type, is_turn)}
          animation_delay={(animation_type === 'take damage') ? '1.25s' : '0.25s'}
        />
      }
      { cell_status.contains_objective && !cell_status.contains_piece &&
        <ObjectiveImg player_id={cell_status.objective_owner!} height={banner_height} width={banner_width} sx={{ pt: banner_height * 0.01 }}/>
      }
      { piece && cell_status.contains_piece && !cell_status.contains_objective && (show_opponent_pieces || piece.player === this_player_id) &&
        <PieceImg
          player_id={piece.player}
          this_player_id={this_player_id}
          piece={piece}
          health={piece.current_stats.health}
          on_board={true}
          selected={selected}
          width={cell_size * 0.95}
          height={cell_size * 0.95}
          animation={getPieceAnimation(piece, animation_initiator, animation_recipient, animation_direction, animation_type, is_turn)}
          animation_delay={(animation_type === 'take damage') ? '1.25s' : '0.25s'}
        />
      }
    </Card>
  );
}