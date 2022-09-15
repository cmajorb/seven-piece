import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Constants, Piece, Map, ColorScheme } from '../types';
import { GetWallColor } from '../utils/getBasicColors';
import { ObjectiveImg, PieceImg, WallImg, ObjectiveAndPieceImg } from './getPNGImages';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  value: number,
  selected: boolean,
  updateSelected: any,
  status: number[],
  pieces: Piece[],
  getPiece: any,
  constants: Constants,
  map: Map,
  color_scheme: ColorScheme
};

// ----------------------------------------------------------------------

export default function Cell({ location, value, selected, updateSelected, status, pieces, getPiece, constants, map, color_scheme }: Props) {
  
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

  const getBorderColor = (value: number) => {
    if ((value & constants.wall as number) == constants.wall) {
      return GetWallColor(color_scheme)
    }
    else if ((value & constants.player as number) == constants.player) {
      if (selected) {
        return theme.palette.primary.main
      } else {
        return "purple"
      }
    }

    if (selected) {
      return theme.palette.primary.main
    }
      return color_scheme.tile_colors.wall as string
  }

  return (
    <>
      { <Card
          style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
          sx={{ width: 58, height: 58, border: 2,
            borderColor: getBorderColor(value),
            backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
            backgroundPosition: 'center',
            backgroundSize: '1000%',
            '&:hover': { cursor: 'pointer' },
          }}
          onClick={() => { updateSelected(location) }}
        >
          {(value & constants.wall as number) == constants.wall  && <WallImg/>}
          {(value & constants.player as number) == constants.player  && <PieceImg piece_name={getPiece(location).character.name} on_board={true}/>}
          {(value & constants.objective as number) == constants.objective  && <ObjectiveImg player_id={-1}/>}
          
        </Card>
      }

    </>  
  );
}