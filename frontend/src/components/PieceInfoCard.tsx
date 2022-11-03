import { useEffect, useState } from 'react';
import { Stats, Piece } from '../types';
import { Card, Stack, Typography, useTheme } from '@mui/material';
import { BottomBarImgs, PieceImg } from './misc/PNGImages';
import { BLACK_COLOR, HOVER_RATIO, MIDDLE_COLOR, TAP_RATIO } from '../utils/defaultColors';

import gsap from 'gsap';
import { Draggable } from 'gsap/all';
gsap.registerPlugin(Draggable);

// ----------------------------------------------------------------------

type Props = {
    observed_piece?: Piece,
    team_pick_option: boolean,
    team_picked?: boolean,
    transferTeam?: any,
};

// ----------------------------------------------------------------------

export default function PieceInfoCard ({ observed_piece, team_pick_option, team_picked, transferTeam }: Props) {

    const theme = useTheme();
    const default_border_color = theme.palette.grey[900];
    const stat_types: string[] = ['health', 'attack', 'speed'];
    const getStatType = (index: number) => { return stat_types[index] };

    const [isFront, setIsFront] = useState<boolean>(true);
    useEffect(() => {
        console.log("Changed front", isFront);
    }, [isFront])

    const trigger_id = observed_piece ? ('#trigger' + observed_piece.id) : '#trigger';
    const proxy_id = observed_piece ? ('#proxy' + observed_piece.id) : '#proxy';
    const front_target_id = observed_piece ? ('#target' + observed_piece.id) : '#target';

    gsap.set(front_target_id, {transformStyle: "preserve-3d", transformPerspective: 1000});

    Draggable.create(proxy_id,
        {
            type:'y',
            // inertia: true,
            trigger: trigger_id,
            onDrag: function () {
                const is_front = Math.round(this.y / 180) % 2 === 0;
                if (isFront !== is_front) { setIsFront(is_front) };
                gsap.set(front_target_id, {rotationX: -this.y})
            }
        }
    );

    return (
        <div id={observed_piece ? ('trigger' + observed_piece.id) : 'trigger'}>
            <Card
                id={observed_piece ? ('target' + observed_piece.id) : 'target'}
                sx={{
                    pr: 1, pl: 1, pb: 1, pt: 1,
                    background: `rgba(0, 0, 0, 0.6) url("https://img.freepik.com/free-photo/metallic-textured-background_53876-89540.jpg?w=1480&t=st=1664334488~exp=1664335088~hmac=d736d5e5e231f4c3de626d7dabe6759613ea143055e0e689c192aa95e3bfdc1f")`,
                    backgroundBlendMode: 'darken',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom',
                    backgroundSize: 'cover',
                    border: 2,
                    width: 340,
                    height: 240,
                    position: 'relative',
                    borderColor: default_border_color,
                    transition: '0.5s',
                    boxShadow: `0px 0px 50px 10px #${team_picked ? MIDDLE_COLOR : BLACK_COLOR}`,
                    ...(team_pick_option && {
                        '&:hover': {
                            cursor: 'pointer',
                            boxShadow: `0px 0px 50px 10px #${team_picked ? MIDDLE_COLOR : 'FFFFFF'}`,
                            scale: HOVER_RATIO,
                        },
                        '&:active': {
                            transition: '0s',
                            scale: TAP_RATIO,
                            filter: 'brightness(80%)',
                        }
                    })
                }}
                onClick={() => { team_pick_option && observed_piece && transferTeam(observed_piece) }}
            >
                { observed_piece && isFront &&
                    <Stack spacing={2} alignItems={'flex-start'} justifyContent={'center'}>
                        <Stack alignItems={'flex-start'} justifyContent={'center'} width={'100%'}>
                            <Stack alignItems={'center'} justifyContent={'center'} width={'100%'} display={'flex'}>
                                <Typography sx={{ marginBottom: 0 }} fontFamily={'fantasy'} fontWeight={'bold'} color={theme.palette.grey[400]} paragraph variant='h5'>{observed_piece.name}</Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={4} justifyContent={'center'} alignItems={'center'} sx={{ pl: 2.5 }}>
                                <PieceImg
                                    piece={observed_piece}
                                    health={0}
                                    on_board={false}
                                    height={120}
                                    width={120}
                                />
                                <Stack spacing={0.25}>
                                    {stat_types.map((stat, index) => (
                                    <BottomBarImgs
                                        key={stat + index}
                                        type={stat === 'attack' ? (observed_piece.current_stats.attack_range_max > 1 ? 'range' : 'melee') : stat}
                                        current_stat={observed_piece.current_stats[getStatType(index) as keyof Stats] as number}
                                        max_stat={observed_piece.start_stats[getStatType(index) as keyof Stats] as number}
                                        height={30}
                                        width={30}
                                        has_buff={stat === 'health' && observed_piece.shield}
                                    />
                                    ))}
                                </Stack>
                            </Stack>
                        </Stack>
                        <Typography fontFamily={'fantasy'} fontWeight={'bold'} color={theme.palette.grey[400]} paragraph variant='body2'>{observed_piece.description}</Typography>
                    </Stack>
                }
            </Card>

            <div id={observed_piece ? ('proxy' + observed_piece.id) : 'proxy'} style={{ display: 'none' }}></div>
        </div>
    );
};