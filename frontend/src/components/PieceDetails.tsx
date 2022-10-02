import { Piece } from '../types';
import { AnimatePresence, m } from 'framer-motion';
import { useState } from 'react';
import { Stack, ToggleButton, useTheme } from '@mui/material';
import { varFade } from '../components/animate';
import Iconify from './misc/Iconify';
import PieceInfoCard from './PieceInfoCard';

// ----------------------------------------------------------------------

type Props = {
  observed_piece?: Piece,
};

// ----------------------------------------------------------------------

export default function PieceDetails ({ observed_piece }: Props) {

  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleToggle = () => { setOpen((prev) => !prev) };

  return (
        <Stack spacing={2} sx={{ position: 'fixed', top: '25%', right: 10 }}>
            <ToggleButton value="check" selected={open} onChange={handleToggle}>
                <Iconify icon={open ? 'eva:arrowhead-right-outline' : 'eva:arrowhead-left-outline'} width={30} height={30} />
            </ToggleButton>

            <AnimatePresence>
                { open && (
                    <m.div
                    key={'animation'}
                    variants={varFade({
                        distance: 1000,
                        durationIn: 1,
                        durationOut: 1,
                        }).inLeft}                  
                    style={{
                        top: '10%',
                        right: 80,
                        position: 'fixed',
                        zIndex: theme.zIndex.drawer + 3,
                    }}>
                        <PieceInfoCard observed_piece={observed_piece} />
                    </m.div>
                )}
            </AnimatePresence>
        </Stack>
    );
};