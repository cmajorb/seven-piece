import { Box } from '@mui/material';
import Ice from '../../images/ice_layer.png';

// ----------------------------------------------------------------------

type Props = {
  cell_size: number,
};

// ----------------------------------------------------------------------

export default function FrozenBox({ cell_size }: Props) {

  return (
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
      </>
  );
}