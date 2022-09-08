import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
  location: number[],
  fillImageURL: string | undefined,
};

// ----------------------------------------------------------------------

export default function Cell({ location, fillImageURL }: Props) {
  
  const theme = useTheme();

  return (
    <Card
      sx={{ minWidth: 50, minHeight: 50, border: 2,
        borderColor: theme.palette.common.black,
        '&:hover': { bgcolor: theme.palette.grey[200], cursor: 'pointer' },
      }}
      onClick={() => { console.log(location) }}
    >
      { fillImageURL && <img width={45} height={45} alt='test' src={fillImageURL}/> }
    </Card>
  );
}