import { Box, Stack, Avatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import WallImage from '../images/rock.png';
import NeutralBanner from '../images/banner_gold.png';
import Team1Banner from '../images/banner_purple.png';
import Team2Banner from '../images/banner_green.png';
import getPieceImg from '../utils/getPieceImg';

// ----------------------------------------------------------------------

type ObjectiveProps = {
    player_id: number,
};

type PieceProps = {
    piece_name: string,
    on_board: boolean,
};

type ObjectiveAndPieceProps = {
    player_id: number,
    piece_name: string,
    start_tiles: string[],
};

// ----------------------------------------------------------------------

const OutlinedAvatar = styled(Avatar)`border: 2px solid black; background-color: black; width: 48px; height: 48px;`;
const getObjectiveAvatar = (color: string) => {
    const ObjectiveAvatar = styled(Avatar)`border: 2px solid black; background-color: ${color}; width: 15px; height: 15px;`;
    return ObjectiveAvatar;
  }

export function WallImg () {
    return (
        <Stack alignItems="center" justifyContent="center">
            <Box height={50} width={50} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <img alt='testing' src={WallImage} height={40} width={40} />
            </Box>
        </Stack>
    );
}

export function ObjectiveImg ({ player_id }: ObjectiveProps) {
    let objective_img = NeutralBanner;
    if (player_id === 0) { objective_img = Team1Banner }
    else if (player_id === 1) { objective_img = Team2Banner };

    return (
        <Stack alignItems="center" justifyContent="center">
            <Box height={50} width={50} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <img alt='testing' src={objective_img} height={35} width={30} />
            </Box>
        </Stack>
    );
}

export function PieceImg ({ piece_name, on_board }: PieceProps) {
    const piece_img = getPieceImg(piece_name);

    return (
        <Stack alignItems="center" justifyContent="center">
            { on_board ? <OutlinedAvatar src={piece_img}/> : <Avatar src={piece_img} variant='square' sx={{ height: 200, width: 200 }}/>}
        </Stack>
    );
}

export function ObjectiveAndPieceImg ({ player_id, start_tiles, piece_name }: ObjectiveAndPieceProps) {
    const piece_img = getPieceImg(piece_name);
    const ObjectiveAvatar = getObjectiveAvatar(start_tiles![player_id]);

    return (
        <Stack alignItems="center" justifyContent="center">
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                <ObjectiveAvatar> </ObjectiveAvatar>
                }
            >
                <OutlinedAvatar src={piece_img}/>
            </Badge>
        </Stack>
    );
}