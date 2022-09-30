import { Stats, Piece } from '../types';
import { AnimatePresence, m } from 'framer-motion';
import { useState } from 'react';
import { Card, Stack, ToggleButton, Typography, useTheme } from '@mui/material';
import { BottomBarImgs, PieceImg } from '../components/misc/PNGImages';
import { varFade } from '../components/animate';
import Iconify from './misc/Iconify';

// ----------------------------------------------------------------------

type Props = {
  observed_piece?: Piece,
};

// ----------------------------------------------------------------------

export default function PieceDetails ({ observed_piece }: Props) {

  const theme = useTheme();
  const default_border_color = theme.palette.grey[900];
  const stat_types: string[] = ['health', 'attack', 'speed'];
  const getStatType = (index: number) => { return stat_types[index] };

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
                        <Card
                            sx={{
                                p: 1,
                                background: `rgba(0, 0, 0, 0.6) url("https://img.freepik.com/free-photo/metallic-textured-background_53876-89540.jpg?w=1480&t=st=1664334488~exp=1664335088~hmac=d736d5e5e231f4c3de626d7dabe6759613ea143055e0e689c192aa95e3bfdc1f")`,
                                backgroundBlendMode: 'darken',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'bottom',
                                backgroundSize: 'cover',
                                border: 2,
                                width: 300,
                                height: 210,
                                borderColor: default_border_color,
                            }}
                        >
                            { observed_piece &&
                            <Stack spacing={2} justifyContent={'center'} alignItems={'flex-start'}>
                                <Stack direction={'row'} spacing={4} justifyContent={'center'} alignItems={'center'} sx={{ pl: 3 }}>
                                    <PieceImg
                                        piece_name={observed_piece.character}
                                        health={0}
                                        on_board={false}
                                        height={120}
                                        width={120}
                                    />
                                    <Stack spacing={0.25}>
                                        {stat_types.map((stat, index) => (
                                        <BottomBarImgs
                                            key={stat + index}
                                            type={stat}
                                            current_stat={observed_piece.default_stats[getStatType(index) as keyof Stats]}
                                            max_stat={observed_piece.default_stats[getStatType(index) as keyof Stats]}
                                            height={30}
                                            width={30}
                                        />
                                        ))}
                                    </Stack>
                                </Stack>
                                <Typography fontFamily={'fantasy'} fontWeight={'bold'} color={theme.palette.grey[400]} paragraph variant='body2'>{observed_piece.description}</Typography>
                            </Stack> }
                        </Card>
                    </m.div>
                )}
            </AnimatePresence>
        </Stack>
    );
};



// ----------------------------------------------------------------------

// const RootStyle = styled(m.div)(({ theme }) => ({
//   ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.92 }),
//   top: 0,
//   right: 0,
//   bottom: 0,
//   display: 'flex',
//   position: 'fixed',
//   overflow: 'hidden',
//   width: NAVBAR.BASE_WIDTH,
//   flexDirection: 'column',
//   margin: theme.spacing(2),
//   paddingBottom: theme.spacing(3),
//   zIndex: theme.zIndex.drawer + 3,
//   borderRadius: Number(theme.shape.borderRadius) * 1.5,
//   boxShadow: `-24px 12px 32px -4px ${alpha(
//     theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
//     0.16
//   )}`,
// }));

// ----------------------------------------------------------------------