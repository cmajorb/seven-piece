import { Box, Stack, Avatar, Badge, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import WallImage from '../images/rock.png';
import SkullImage from '../images/skull.png';
import PieceHealth from '../images/health_icon.png';
import NeutralBanner from '../images/banner_gold.png';
import NeutralKillBanner from '../images/banner_black.png';
import Team1Banner from '../images/banner_purple.png';
import Team2Banner from '../images/banner_green.png';
import getPieceImg from '../utils/getPieceImg';
import PieceBackground from '../images/avatar-frame_silver.png';

// ----------------------------------------------------------------------

type ObjectiveProps = {
    player_id: number,
    width: number,
    height: number,
    img_width?: number,
    img_height?: number,
    req_score?: number,
};

type PieceProps = {
    player_id?: number,
    piece_name: string,
    health?: number,
    on_board: boolean,
};

type ObjectiveAndPieceProps = {
    player_id: number,
    piece_name: string,
    health: number,
    start_tiles: string[],
};

// ----------------------------------------------------------------------

const OutlinedAvatar = styled(Avatar)`border: 2px solid black; background-color: black; width: 48px; height: 48px;`;

export function WallImg () {
    return (
        <Stack alignItems="center" justifyContent="center">
            <Box height={70} width={70} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <img alt='testing' src={WallImage} height={60} width={60} />
            </Box>
        </Stack>
    );
}

export function ObjectiveImg ({ player_id, width, height, img_width, img_height, req_score }: ObjectiveProps) {
    const theme = useTheme();
    let objective_img = NeutralBanner;
    if (player_id === 0) { objective_img = Team1Banner }
    else if (player_id === 1) { objective_img = Team2Banner }
    else if (req_score) { objective_img = NeutralKillBanner };

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ pt: 0.25 }}>
            <Box height={height} width={width} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <img alt='testing' src={objective_img} height={img_height ? img_height : 35} width={img_width ? img_width : 30} />
            </Box>
            { req_score &&
            <Box height={30} width={30} sx={{ pb: 1, justifyContent: "center", alignItems: "flex-start", display: "flex", position: "absolute" }}>
                <Typography variant='h5' fontWeight={'bold'} sx={{ color: theme.palette.grey[300] }}>
                    {req_score}
                </Typography>
            </Box> }    
        </Stack>
    );
}

export function KillObjectiveImg ({ player_id, width, height }: ObjectiveProps) {
    const skull_img = SkullImage;
    let objective_img = NeutralKillBanner;
    if (player_id === 0) { objective_img = Team1Banner }
    else if (player_id === 1) { objective_img = Team2Banner };

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ pt: 0.25, position: "relative" }}>
            <Box height={height} width={width} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <img alt='testing' src={objective_img} height={35} width={30} />
            </Box>
            <Box height={30} width={30} sx={{ justifyContent: "center", alignItems: "flex-start", display: "flex", position: "absolute" }}>
                <img alt='testing' src={skull_img} height={25} width={20} />
            </Box>
        </Stack>
    );
}

export function PieceImg ({ player_id, piece_name, health, on_board }: PieceProps) {
    const piece_img = getPieceImg(piece_name);
    const heart_nums = (Array.from(Array(health).keys()));
    let filter_string: string = 'invert(100%) sepia(100%) saturate(400%) hue-rotate(610deg) brightness(40%) contrast(100%)';
    if (player_id === 1) { filter_string = 'invert(100%) sepia(100%) saturate(500%) hue-rotate(410deg) brightness(60%) contrast(100%)' };

    return (
        <Stack alignItems="center" justifyContent="center">
            { on_board ?
            <Stack alignItems="center" justifyContent="center" sx={{ position: "relative" }}>
                <Box height={70} width={70} sx={{ justifyContent: "center", alignItems: "flex-start", display: "flex", position: "absolute" }}>
                    <img alt='testing' src={PieceBackground} height={70} width={70} style={{ filter: `${filter_string}` }} />
                </Box>
                <OutlinedAvatar src={piece_img}/>
                <Stack direction={'row'} spacing={1} sx={{ position: "absolute", pt: 7.75 }}>
                    { heart_nums.map((health) => (
                        <Box key={health} height={12} width={12} sx={{ display: "flex" }}>
                            <img alt='testing' src={PieceHealth} height={12} width={12} />
                        </Box>
                    )) }
                </Stack>                
            </Stack> :
            <Avatar src={piece_img} variant='square' sx={{ height: 200, width: 200 }}/>
            }
        </Stack>
    );
}

export function ObjectiveAndPieceImg ({ player_id, piece_name, health, start_tiles }: ObjectiveAndPieceProps) {
    const piece_img = getPieceImg(piece_name);
    const heart_nums = (Array.from(Array(health).keys()));
    const ObjectiveAvatar = styled(Avatar)(() => ({
        backgroundColor: 'transparent',
        width: 16.5,
        height: 18,
        imgProps: { sx: { width: 1, height: 1 } }
    }));
    let filter_string: string = 'invert(100%) sepia(100%) saturate(400%) hue-rotate(610deg) brightness(40%) contrast(100%)';
    if (player_id === 1) { filter_string = 'invert(100%) sepia(100%) saturate(500%) hue-rotate(410deg) brightness(60%) contrast(100%)' };

    return (
        <Stack alignItems="center" justifyContent="center">
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={<ObjectiveAvatar variant={'square'} src={NeutralBanner}/>}
            >
                <Stack alignItems="center" justifyContent="center" sx={{ position: "relative" }}>
                    <Box height={70} width={70} sx={{ justifyContent: "center", alignItems: "flex-start", display: "flex", position: "absolute" }}>
                        <img alt='testing' src={PieceBackground} height={70} width={70} style={{ filter: `${filter_string}` }} />
                    </Box>
                    <OutlinedAvatar src={piece_img}/>
                    <Stack direction={'row'} spacing={1} sx={{ position: "absolute", pt: 7.75 }}>
                        { heart_nums.map((health) => (
                            <Box key={health} height={12} width={12} sx={{ display: "flex" }}>
                                <img alt='testing' src={PieceHealth} height={12} width={12} />
                            </Box>
                        )) }
                    </Stack>                    
                </Stack>
            </Badge>
        </Stack>
    );
}