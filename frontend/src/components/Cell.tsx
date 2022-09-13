import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Constants, Piece, Map } from '../types';
import { GetWallColor } from '../utils/getBasicColors';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from './getPNGImages';

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
          style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
          sx={{ width: 58, height: 58, border: 2,
            borderColor: GetWallColor(map),
            backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
            backgroundPosition: 'center',
            backgroundSize: '1000%',
            '&:hover': { cursor: 'pointer' },
          }}
        >
          <WallImg/>    
        </Card>
      }

      { !is_wall && piece &&
        <Card
          style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
          sx={{ width: 58, height: 58, border: 2,
            borderColor: selected? theme.palette.primary.main : map.color_scheme.start_tiles[piece.player],
            backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
            backgroundPosition: 'center',
            backgroundSize: '1000%',
            ...(piece && { bgcolor: map.color_scheme.start_tiles[piece.player as number] }),
            '&:hover': {
              cursor: 'pointer',
              ...(piece ? { bgcolor: map.color_scheme.start_tiles[piece.player as number], opacity: 0.72 } :
                { bgcolor: theme.palette.grey[200] })
            },
          }}
          onClick={() => { getCellStatus(location, map); updateSelected(location, piece) }}
        >
          { contains_objective ? <ObjectiveAndPieceImg player_id={piece.player} start_tiles={map.color_scheme.start_tiles} piece_name={piece.character}/> : <PieceImg piece_name={piece.character} on_board={true}/> }
        </Card>
      }

      { !is_wall && !piece && contains_objective &&
        <Card
          style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
          sx={{ width: 58, height: 58, border: 2, alignItems: "center", alignContent: "center", justifyContent: "center",
            borderColor: selected? theme.palette.primary.main : map.color_scheme.tile_colors.wall as string,
            backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
            backgroundPosition: 'center',
            backgroundSize: '1000%',
            ...(selected && { bgcolor: theme.palette.grey[200] }),
            '&:hover': { cursor: 'pointer', bgcolor: theme.palette.grey[200] },
          }}
          onClick={() => { getCellStatus(location, map); updateSelected(location) }}
        >
          <ObjectiveImg player_id={-1}/>
        </Card>
      }

      { !is_wall && !piece && !contains_objective &&
        <Card
          style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
          sx={{ width: 58, height: 58, border: 2,
            borderColor: selected? theme.palette.primary.main : map.color_scheme.tile_colors.wall as string,
            backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
            backgroundPosition: 'center',
            backgroundSize: '1000%',
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