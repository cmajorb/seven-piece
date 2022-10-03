import { Piece } from '../../types';
import { AnimatePresence, m } from 'framer-motion';
import { useState } from 'react';
import { Stack, useTheme } from '@mui/material';
import { varFade } from '../animate';
import Iconify from '../misc/Iconify';
import PieceInfoCard from '../PieceInfoCard';

// ----------------------------------------------------------------------

type Props = {
  observed_piece: Piece,
  width: number,
  height: number,
};

// ----------------------------------------------------------------------

export default function PieceDetails ({ observed_piece, width, height }: Props) {

  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const handleToggle = () => { setOpen((prev) => !prev) };

  return (
        <>
            <Stack onClick={handleToggle} justifyContent={'center'} alignItems={'center'}>
                <Iconify icon={open ? 'eva:arrowhead-right-outline' : 'eva:arrowhead-left-outline'} width={width} height={height} sx={{ color: theme.palette.grey[500] }} />
            </Stack>

            <AnimatePresence>
                { open && observed_piece && (
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
                        <PieceInfoCard observed_piece={observed_piece} />
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
};