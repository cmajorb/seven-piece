import { Box, Card, useTheme } from '@mui/material';
import { Piece, ColorScheme, CellStatus, GameStatus } from '../../types';
import checkSameLocation from '../../utils/checkSameLocation';
import GetBorderColor from '../../utils/getBorderColor';
import getPiece from '../../utils/pieces/getPiece';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from '../misc/PNGImages';
import Ice from '../../images/ice_layer.png';
import getBannerDimensions from '../../utils/getBannerDimensions';

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
};

// ----------------------------------------------------------------------

export default function Cell({
  location, cell_size, selected, selected_piece_actions, cell_status, pieces,
  color_scheme, this_player_id, current_state, start_tiles, updateSelected
}: Props) {
  
  const theme = useTheme();
  const piece: Piece | undefined = getPiece(location, pieces);

  const banner_dimensions = getBannerDimensions(cell_size);
  const banner_width = banner_dimensions[0];
  const banner_height = banner_dimensions[1];

  const show_opponent_pieces: boolean = (current_state === 'PLACING') ? false : true;

  function isValidPieceMove () {
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
  }

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
      
      {piece && piece.state === 'frozen' &&
      <>
        <Box height={cell_size * 0.2} width={cell_size * 0.9} sx={{ display: "flex", position: 'absolute', zIndex: 90 }}>
            <img alt='testing' src={Ice} height={cell_size * 0.2} width={cell_size * 0.9} />
        </Box>
        <Box height={cell_size * 0.9} width={cell_size * 0.2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", position: 'absolute', zIndex: 90 }}>
            <img alt='testing' src={Ice} height={cell_size * 0.2} width={cell_size * 0.9} style={{ transform: `translate(80%, 0%) rotate(90deg)` }} />
        </Box>
        <Box height={cell_size * 0.2} width={cell_size * 0.9} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", position: 'absolute', zIndex: 90 }}>
            <img alt='testing' src={Ice} height={cell_size * 0.2} width={cell_size * 0.9} style={{ transform: `translate(0%, 380%) rotate(180deg)` }} />
        </Box>
        <Box height={cell_size * 0.9} width={cell_size * 0.2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", position: 'absolute', zIndex: 90 }}>
            <img alt='testing' src={Ice} height={cell_size * 0.2} width={cell_size * 0.9} style={{ transform: `translate(-2%, 30%) rotate(270deg)` }} />
        </Box>
      </> }

      { cell_status.contains_wall &&
        <WallImg size={cell_size}/>
      }
      { piece && cell_status.contains_objective && cell_status.contains_piece && (show_opponent_pieces || piece.player === this_player_id) &&
        <ObjectiveAndPieceImg
          player_id={piece.player}
          piece={piece}
          selected={selected}
          size={cell_size * 0.95}
        />
      }
      { cell_status.contains_objective && !cell_status.contains_piece &&
        <ObjectiveImg player_id={cell_status.objective_owner!} height={banner_height} width={banner_width} sx={{ pt: banner_height * 0.01 }}/>
      }
      { piece && cell_status.contains_piece && !cell_status.contains_objective && (show_opponent_pieces || piece.player === this_player_id) &&
        <PieceImg
          player_id={piece.player}
          piece={piece}
          health={piece.current_stats.health}
          on_board={true}
          selected={selected}
          width={cell_size * 0.95}
          height={cell_size * 0.95}
        />
      }
    </Card>
  );
}