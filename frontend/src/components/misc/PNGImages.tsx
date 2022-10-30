import { Box, Stack, Avatar, Badge, SxProps } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';
import WallImage from '../../images/rock.png';
import SkullImage from '../../images/skull.png';
import PieceHealth from '../../images/health_icon.png';
import PieceMeleeAttack from '../../images/attack_icon.png';
import PieceRangeAttack from '../../images/arrow_icon.png';
import PieceFreeze from '../../images/magic_icon.png';
import PieceSpeed from '../../images/speed_icon.png';
import PieceShield from '../../images/defense_icon.png';
import NeutralBanner from '../../images/banner_gold.png';
import NeutralKillBanner from '../../images/banner_black.png';
import Team1Banner from '../../images/banner_purple.png';
import Team2Banner from '../../images/banner_green.png';
import PieceBackground from '../../images/avatar-frame_silver.png';
import { Piece } from '../../types';

// ----------------------------------------------------------------------

type WallProps = {
    size: number,
};

type ObjectiveProps = {
    player_id: number,
    width: number,
    height: number,
    img_width?: number,
    img_height?: number,
    req_score?: number,
    sx?: SxProps,
};

type PieceProps = {
    player_id?: number,
    piece: Piece,
    health?: number,
    on_board: boolean,
    selected?: boolean,
    team_num?: number,
    height?: number,
    width?: number,
    sx?: SxProps,
    animation?: any,
};

type BottomProps = {
    current_stat: number,
    max_stat: number,  
    type: string,
    height: number,
    width: number,
    has_buff?: boolean,
};

type ObjectiveAndPieceProps = {
    player_id: number,
    piece: Piece,
    selected: boolean,
    size: number,
    animation?: any,
};

// ----------------------------------------------------------------------

const animation_speed = '0.5s';
const attack_animation_speed = '1s';
const piece_decrease = (keyframes`from { padding-top: 1%; } to { padding-top: 0%; }`);
const OutlinedAvatar = styled(Avatar)`border: 2px solid black; background-color: black;`;

export function WallImg ({ size }: WallProps) {
    return (
        <Stack alignItems="center" justifyContent="center">
            <Box height={size} width={size} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <img alt='testing' src={WallImage} height={size / 1.2} width={size / 1.2} style={{ filter: 'brightness(50%)' }} />
            </Box>
        </Stack>
    );
}

export function ObjectiveImg ({ player_id, width, height, sx }: ObjectiveProps) {
    let objective_img = NeutralBanner;
    if (player_id === 0) { objective_img = Team1Banner }
    else if (player_id === 1) { objective_img = Team2Banner }
    else if (player_id === -2) { objective_img = NeutralKillBanner };

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ pt: 0, ...(sx && { ...sx }) }}>
            <Box height={height} width={width} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <img alt='testing' src={objective_img} height={height * 0.7} width={width * 0.75} />
            </Box>  
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
                <img alt='testing' src={objective_img} height={height * 0.7} width={width * 0.75} />
            </Box>
            <Box height={height * 0.6} width={width * 0.6} sx={{ justifyContent: "center", alignItems: "center", display: "flex", position: "absolute" }}>
                <img alt='testing' src={skull_img} height={height * 0.5} width={width * 20} />
            </Box>
        </Stack>
    );
}

export function PieceImg ({ player_id, piece, health, on_board, selected, height, width, sx, animation }: PieceProps) {
    // const heart_nums = (Array.from(Array(health).keys()));
    const default_piece_container_size = 60;
    const default_piece_image_size = 42;
    // const default_health_size = 14;
    let filter_string: string = 'invert(100%) sepia(100%) saturate(400%) hue-rotate(610deg) brightness(40%) contrast(100%)';
    if (player_id === 1) { filter_string = 'invert(100%) sepia(100%) saturate(500%) hue-rotate(410deg) brightness(60%) contrast(100%)' };

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                ...(animation && { zIndex: 9999, animation: `${animation} ${attack_animation_speed} 0.25s ease-in-out forwards` }),
                ...(on_board && { position: "absolute", paddingTop: '0.75%' }),
                ...(sx && { sx }),
                ...(on_board && selected && { animation: `${piece_decrease} ${animation_speed} forwards linear` }),
            }}
        >
            <Stack alignItems="center" justifyContent="center" sx={{ position: "relative" }}>
                <Box
                    height={height ? height : default_piece_container_size}
                    width={width ? width : default_piece_container_size}
                    sx={{ justifyContent: "center", alignItems: "flex-start", display: "flex", position: "absolute" }}
                >
                    <img
                        alt='piece'
                        src={PieceBackground} height={height ? height : default_piece_container_size}
                        width={width ? width : default_piece_container_size}
                        style={{
                            filter: `${on_board ? filter_string : 'brightness(70%)'}`,
                            transition: animation_speed,
                            scale: (on_board && selected) ? '1.5' : '1',
                        }}
                    />
                </Box>
                <OutlinedAvatar
                    src={piece.image}
                    sx={{
                        width: (width ? (width * (default_piece_image_size/default_piece_container_size)) : default_piece_image_size),
                        height: (height ? (height * (default_piece_image_size/default_piece_container_size)) : default_piece_image_size),
                        transition: animation_speed,
                        scale: (on_board && selected) ? '1.5' : '1',
                    }}
                />
                {/* <Stack direction={'row'} spacing={0.05} sx={{ position: "absolute", pt: 8.5 }}>
                    { heart_nums.map((health) => (
                        <Box
                            key={health}
                            height={height ? (height / 5) : default_health_size}
                            width={width ? (width / 5) : default_health_size}
                            sx={{ display: "flex" }}
                        >
                            <img alt='testing' src={PieceHealth} height={height ? (height / 5) : default_health_size} width={width ? (width / 5) : default_health_size} />
                        </Box>
                    )) }
                </Stack> */}
            </Stack>
        </Stack>
    );
}

export function BottomBarImgs ({ current_stat, max_stat, type, height, width, has_buff }: BottomProps) {
    const current_stat_nums = (Array.from(Array(current_stat).keys()));
    const max_stat_nums = (Array.from(Array(max_stat - current_stat).keys()));
    let piece_img = '';
    if (type === 'melee') { piece_img = PieceMeleeAttack }
    else if (type === 'range') { piece_img = PieceRangeAttack }
    else if (type === 'freeze') { piece_img = PieceFreeze }
    else if (type === 'speed') { piece_img = PieceSpeed }
    else if (type === 'health') { piece_img = PieceHealth };

    let buff_img = '';
    if (type === 'health') { buff_img = PieceShield };

    return (
        <Stack direction={'row'} spacing={0.05}>
            { piece_img.length > 0 ?
            <>
                { current_stat_nums.map((stat) => (
                    <Box key={stat} height={height} width={width} sx={{ display: "flex" }}>
                        <img alt='testing' src={piece_img} height={height} width={width} />
                    </Box>
                )) }
                { max_stat_nums.map((stat) => (
                    <Box key={stat} height={height} width={width} sx={{ display: "flex" }}>
                        <img alt='testing' src={piece_img} height={height} width={width} style={{ filter: 'grayscale(100%)' }} />
                    </Box>
                )) }
                { has_buff &&
                    <Box height={height} width={width} sx={{ display: "flex" }}>
                        <img alt='testing' src={buff_img} height={height} width={width} />
                    </Box>
                }
            </> :
            <Box height={height} width={width} sx={{ display: "flex", backgroundColor: 'gray', opacity: '0.2' }}/> }
            { current_stat_nums.length === 0 && max_stat_nums.length === 0 &&
                <Box height={height} width={width} sx={{ display: "flex", backgroundColor: 'gray', opacity: '0' }}/>
            }
        </Stack>
    );
}

export function ObjectiveAndPieceImg ({ player_id, piece, selected, size, animation }: ObjectiveAndPieceProps) {
    let objective_img = NeutralBanner;
    const default_piece_container_size = 60;
    const default_piece_image_size = 42;

    if (player_id === 0) { objective_img = Team1Banner }
    else if (player_id === 1) { objective_img = Team2Banner };
    const ObjectiveAvatar = styled(Avatar)(() => ({
        backgroundColor: 'transparent',
        width: (size / 3),
        height: (size / 2.72),
        imgProps: { sx: { width: 1, height: 1, transition: animation_speed, scale: selected ? '1.5' : '1' } }
    }));
    let filter_string: string = 'invert(100%) sepia(100%) saturate(400%) hue-rotate(610deg) brightness(40%) contrast(100%)';
    if (player_id === 1) { filter_string = 'invert(100%) sepia(100%) saturate(500%) hue-rotate(410deg) brightness(60%) contrast(100%)' };

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "absolute",
                paddingTop: '0.75%',
                ...(animation && { zIndex: 9999, animation: `${animation} ${attack_animation_speed} 0.25s ease-in-out forwards` }),
                ...(selected && { animation: `${piece_decrease} ${animation_speed} forwards linear` })
            }}
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={<ObjectiveAvatar variant={'square'} src={objective_img}/>}
            >
                <Stack alignItems="center" justifyContent="center" sx={{ position: "relative" }}>
                    <Box
                        height={size}
                        width={size}
                        sx={{ justifyContent: "center", alignItems: "flex-start", display: "flex", position: "absolute" }}>
                        <img
                            alt='testing'
                            src={PieceBackground}
                            height={size}
                            width={size}
                            style={{
                                filter: `${filter_string}`,
                                transition: animation_speed,
                                scale: selected ? '1.5' : '1',
                            }}
                        />
                    </Box>
                    <OutlinedAvatar
                        src={piece.image}
                        sx={{
                            width: (size ? (size * (default_piece_image_size/default_piece_container_size)) : default_piece_image_size),
                            height: (size ? (size * (default_piece_image_size/default_piece_container_size)) : default_piece_image_size),
                            transition: animation_speed,
                            scale: selected ? '1.5' : '1',
                        }}
                    />
                    {/* <Stack direction={'row'} spacing={0.05} sx={{ position: "absolute", pt: 8.5 }}>
                        { heart_nums.map((health) => (
                            <Box key={health} height={14} width={14} sx={{ display: "flex" }}>
                                <img alt='testing' src={PieceHealth} height={14} width={14} />
                            </Box>
                        )) }
                    </Stack> */}
                </Stack>
            </Badge>
        </Stack>
    );
}