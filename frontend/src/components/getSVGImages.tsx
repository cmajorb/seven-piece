import { Stack, SvgIcon, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

type ObjectiveProps = {
    player_id: number,
};

type PieceProps = {
    svg_image: string,
    width?: string,
    height?: string,
};

type ObjectiveAndPieceProps = {
    player_id: number,
    svg_image: string,
};

// ----------------------------------------------------------------------

export function ObjectiveImg ({ player_id }: ObjectiveProps) {
    const theme = useTheme();
    let fill_color = theme.palette.common.black;
    if (player_id === 0) { fill_color = theme.palette.primary.main }
    else if (player_id === 1) { fill_color = theme.palette.success.main };

    return (
        <Stack alignItems="center" justifyContent="center">
            <SvgIcon viewBox="0 0 490 400">
                <path
                    fill={fill_color}
                    stroke={theme.palette.common.black}
                    d={"M87.892 13.983h46.7v476h-46.7zm66.9.7v150.1c82.4 50.9 164.9-50.9 247.3 0v-150.1c-82.401-50.9-164.901 51-247.3 0z"}
                />
            </SvgIcon>
        </Stack>
    );
}

export function PieceImg ({ svg_image, width, height }: PieceProps) {
    const theme = useTheme();
    const fill_color = theme.palette.common.black;

    return (
        <Stack alignItems="center" justifyContent="center">
            <SvgIcon stroke={fill_color} viewBox={"0 0 64 64"} width={width} height={height}>
                <path d={svg_image}/>
            </SvgIcon>
        </Stack>
    );
}

export function ObjectiveAndPieceImg ({ player_id, svg_image }: ObjectiveAndPieceProps) {
    const theme = useTheme();
    const fill_color = theme.palette.common.black;

    return (
        <Stack alignItems="center" justifyContent="center" direction={"row"}>
            <SvgIcon stroke={fill_color} viewBox={"0 0 64 64"}>
                <path d={svg_image}/>
            </SvgIcon>
            <SvgIcon viewBox="0 0 490 400">
                <path
                    fill={fill_color}
                    stroke={fill_color}
                    d={"M87.892 13.983h46.7v476h-46.7zm66.9.7v150.1c82.4 50.9 164.9-50.9 247.3 0v-150.1c-82.401-50.9-164.901 51-247.3 0z"}
                />
            </SvgIcon>
        </Stack>
    );
}