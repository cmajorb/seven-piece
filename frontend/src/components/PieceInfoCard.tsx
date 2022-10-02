import { Stats, Piece } from '../types';
import { Card, Stack, Typography, useTheme } from '@mui/material';
import { BottomBarImgs, PieceImg } from './misc/PNGImages';
import { BLACK_COLOR, HOVER_RATIO, MIDDLE_COLOR, TAP_RATIO } from '../utils/defaultColors';

// ----------------------------------------------------------------------

type Props = {
    observed_piece?: Piece,
    team_pick_option?: boolean,
    team_picked?: boolean,
    transferTeam?: any,
};

// ----------------------------------------------------------------------

export default function PieceInfoCard ({ observed_piece, team_pick_option, team_picked, transferTeam }: Props) {

    const theme = useTheme();
    const default_border_color = theme.palette.grey[900];
    const stat_types: string[] = ['health', 'attack', 'speed'];
    const getStatType = (index: number) => { return stat_types[index] };

    return (
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
            onClick={() => { team_pick_option && transferTeam(observed_piece) }}
        >
            { observed_piece &&
            <Stack spacing={2} justifyContent={'center'} alignItems={'flex-start'}>
                <Stack direction={'row'} spacing={4} justifyContent={'center'} alignItems={'center'} sx={{ pl: 3 }}>
                    <PieceImg
                        piece_name={observed_piece.name}
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
                            current_stat={observed_piece.default_stats[getStatType(index) as keyof Stats] as number}
                            max_stat={observed_piece.default_stats[getStatType(index) as keyof Stats] as number}
                            height={30}
                            width={30}
                        />
                        ))}
                    </Stack>
                </Stack>
                <Typography fontFamily={'fantasy'} fontWeight={'bold'} color={theme.palette.grey[400]} paragraph variant='body2'>{observed_piece.description}</Typography>
            </Stack> }
        </Card>
    );
};