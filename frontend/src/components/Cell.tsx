import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Constants, Piece, Map } from '../types';
import { GetWallColor } from '../utils/getBasicColors';
import { ObjectiveImg, PieceImg, ObjectiveAndPieceImg } from './getSVGImages';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  selected: boolean,
  updateSelected: any,
  status: number[],
  pieces: Piece[],
  constants: Constants,
  map: Map,
};

// ----------------------------------------------------------------------

export default function Cell({ location, selected, updateSelected, status, pieces, constants, map }: Props) {
  
  const theme = useTheme();
  const is_wall: boolean = status.includes(constants.wall as number);
  const contains_piece: boolean = status.includes(constants.player as number);
  const contains_objective: boolean = status.includes(constants.objective as number);

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

      { !is_wall && piece &&
        <Card
          style={{ justifyContent: "center", display: "flex" }}
          sx={{ minWidth: 50, minHeight: 50, border: 2,
            borderColor: selected? theme.palette.primary.main : map.color_scheme.tile_colors.wall as string,
            ...(piece && { bgcolor: map.color_scheme.start_tiles[piece.player as number] }),
            '&:hover': {
              cursor: 'pointer',
              ...(piece ? { bgcolor: map.color_scheme.start_tiles[piece.player as number], opacity: 0.72 } :
                { bgcolor: theme.palette.grey[200] })
            },
          }}
          onClick={() => { getCellStatus(location, map); updateSelected(location, piece) }}
        >
          { contains_objective ? <PieceImg svg_image={piece.image} /> : <ObjectiveAndPieceImg player_id={1} svg_image={piece.image} /> }
        </Card>
      }

      { !is_wall && !piece && contains_objective &&
        <Card
          style={{ justifyContent: "center", display: "flex" }}
          sx={{ minWidth: 50, minHeight: 50, border: 2, alignItems: "center", alignContent: "center", justifyContent: "center",
            borderColor: selected? theme.palette.primary.main : map.color_scheme.tile_colors.wall as string,
            ...(selected && { bgcolor: theme.palette.grey[200] }),
            '&:hover': { cursor: 'pointer', bgcolor: theme.palette.grey[200] },
          }}
          onClick={() => { getCellStatus(location, map); updateSelected(location) }}
        >
          <ObjectiveImg player_id={1} />
        </Card>
      }

      { !is_wall && !piece && !contains_objective &&
        <Card
          sx={{ minWidth: 50, minHeight: 50, border: 2,
            borderColor: selected? theme.palette.primary.main : map.color_scheme.tile_colors.wall as string,
            ...(selected && { bgcolor: theme.palette.grey[200] }),
            '&:hover': { cursor: 'pointer', bgcolor: theme.palette.grey[200] },
          }}
          onClick={() => { getCellStatus(location, map); updateSelected(location) }}
        >
        </Card>
      }
    </>  
  );
}