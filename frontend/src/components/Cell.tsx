import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  gameState: any[]
};

// ----------------------------------------------------------------------

export default function Cell({ location, gameState }: Props) {
  
  const constants_info = require('../testing/constants.json');
  const pieces_info = require('../testing/pieces.json');
  const theme = useTheme();

  const [selected, setSelected] = useState<boolean>(false);
  const handleSelected = () => {
    if (selected) { setSelected(false) }
    else (setSelected(true));
  };

  const getCharacterImage = (location: number[], gameState: any[], pieces_info: any) => {
    const current_location = gameState[location[0]][location[1]];
    if (current_location === 16) {
      for (let index in pieces_info.pieces) {
        const info = pieces_info.pieces[index];
        if (location[0] === info.location_x && location[1] === info.location_y) {
          return info.image_url;
        }
      }
    }
    return undefined;
  }
  const fill_image_url: string | undefined = getCharacterImage(location, gameState, pieces_info);

  const getCellStatus = (location: number[], gameState: any[], constants_info: any) => {
    const current_location = gameState[location[0]][location[1]];
    // TESTING VISIBILITY
    // const constants_keys = Object.keys(constants_info);
    // for (let index in constants_keys) {
    //   const key = constants_keys[index];
    //   if (constants_info[key as keyof typeof constants_info] === current_location) {
    //     console.log(`LOCATION: [${location}], CELL STATUS: ${key}, STATUS NUMBER: ${current_location}`);
    //     break;
    //   }
    // };
    return current_location;
  }

  useEffect(() => {}, [selected])

  return (
    <Card
      sx={{ minWidth: 50, minHeight: 50, border: 2,
        borderColor: selected? theme.palette.primary.main : theme.palette.common.black,
        ...(selected && { bgcolor: selected && theme.palette.grey[200] }),
        ...(getCellStatus(location, gameState, constants_info) === 4 && { backgroundColor: theme.palette.common.black }),
        '&:hover': { bgcolor: theme.palette.grey[200], cursor: 'pointer' },
      }}
      onClick={() => { getCellStatus(location, gameState, constants_info); handleSelected() }}
    >
      { fill_image_url && <img width={45} height={45} alt='test' src={fill_image_url}/> }
    </Card>
  );
}