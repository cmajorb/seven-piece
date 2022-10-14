import { Piece } from '../../types';
import { AnimatePresence, m } from 'framer-motion';
import { Stack, useTheme } from '@mui/material';
import { varFade } from '../animate';
import Iconify from '../misc/Iconify';
import PieceInfoCard from '../PieceInfoCard';

// ----------------------------------------------------------------------

type Props = {
  observed_piece: Piece,
  width: number,
  height: number,
  infoOpen: boolean,
  handleInfoToggle: any,
};

// ----------------------------------------------------------------------

export default function PieceDetails ({ observed_piece, width, height, infoOpen, handleInfoToggle }: Props) {

  const theme = useTheme();

  return (
        <>
            <Stack onClick={handleInfoToggle} justifyContent={'center'} alignItems={'center'}>
                <Iconify icon={infoOpen ? 'eva:arrowhead-right-outline' : 'eva:arrowhead-left-outline'} width={width} height={height} sx={{ color: theme.palette.grey[500] }} />
            </Stack>

            <AnimatePresence>
                { infoOpen && observed_piece && (
                    <m.div
                    key={'animation'}
                    variants={varFade({
                        distance: 1000,
                        durationIn: 1,
                        durationOut: 1,
                        }).inLeft}
                    style={{
                        top: '13%',
                        right: 80,
                        position: 'fixed',
                        zIndex: theme.zIndex.drawer + 3,
                    }}>
                        <PieceInfoCard observed_piece={observed_piece} team_pick_option={false} />
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
};