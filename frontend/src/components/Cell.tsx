import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { Piece } from '../types';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  gameState: any[],
  selected: boolean,
  updateSelectedTile: any,
  piece: Piece,
  status: number[],
};

// ----------------------------------------------------------------------

export default function Cell({ location, gameState, selected, updateSelectedTile, piece, status }: Props) {
  
  const theme = useTheme();

  const getCellStatus = (location: number[], gameState: any[]) => {
    const current_location = gameState[location[0]][location[1]];
    return current_location;
  }

  useEffect(() => {}, [selected])

  return (
    <Card
      sx={{ minWidth: 50, minHeight: 50, border: 2,
        borderColor: selected? theme.palette.primary.main : theme.palette.common.black,
        ...(selected && { bgcolor: selected && theme.palette.grey[200] }),
        ...(getCellStatus(location, gameState) === 4 && { backgroundColor: theme.palette.common.black }),
        '&:hover': { bgcolor: theme.palette.grey[200], cursor: 'pointer' },
      }}
      onClick={() => { getCellStatus(location, gameState); updateSelectedTile(location) }}
    >
      { piece && piece.image && <img width={45} height={45} alt='test' src={piece.image}/> }
    </Card>
  );
}