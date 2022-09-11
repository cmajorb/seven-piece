import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Constants, Piece, Map } from '../types';
import { GetWallColor } from '../utils/getBasicColors';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  selected: boolean,
  updateSelectedTile: any,
  status: number[],
  pieces: Piece[],
  constants: Constants,
  map: Map,
};

// ----------------------------------------------------------------------

export default function Cell({ location, selected, updateSelectedTile, status, pieces, constants, map }: Props) {
  
  const theme = useTheme();
  const is_wall = status.includes(constants.wall as number);
  const contains_piece = status.includes(constants.player as number);

  const getCellStatus = (location: number[], map: Map) => {
    const current_location = map.data[location[0]][location[1]];
    return current_location;
  }

  const getPresentPiece = (curr_location: number[], pieces: any, status: number[]) => {
    if (contains_piece) {
      for (let index in pieces) {
        const piece = pieces[index];
        if (curr_location[0] === piece.location[0] && curr_location[1] === piece.location[1]) { return piece };
      }
    } else { return undefined };
  }

  const piece: Piece | undefined = getPresentPiece(location, pieces, status);

  return (
    <>
      { is_wall &&
        <Card
          sx={{ minWidth: 50, minHeight: 50, border: 2,
            borderColor: GetWallColor(map),
            backgroundColor: GetWallColor(map),
            '&:hover': { cursor: 'pointer' },
          }}
        >
        </Card>
      }
      { !is_wall &&
        <Card
          sx={{ minWidth: 50, minHeight: 50, border: 2,
            borderColor: selected? theme.palette.primary.main : map.color_scheme.tile_colors.wall as string,
            ...(selected && { bgcolor: selected && theme.palette.grey[200] }),
            ...(piece && { bgcolor: piece && map.color_scheme.start_tiles[piece.player as number] }),
            '&:hover': { bgcolor: theme.palette.grey[200], cursor: 'pointer' },
          }}
          onClick={() => { getCellStatus(location, map); updateSelectedTile(location) }}
        >
          { piece && piece.image && <img width={45} height={45} alt='test' src={piece.image}/> }
        </Card>
      }
    </>  
  );
}