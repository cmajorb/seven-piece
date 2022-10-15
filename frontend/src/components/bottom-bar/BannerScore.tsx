import { Stack } from '@mui/material';
import { Score } from '../../types';
import getBannerDimensions from '../../utils/getBannerDimensions';
import { getScoreArray } from '../../utils/getScoreArray';
import { KillObjectiveImg, ObjectiveImg } from '../misc/PNGImages';

// ----------------------------------------------------------------------

type Props = {
    bar_height: number,
    player_id: number,
    team_scores: Score[],
    score_to_win: number,
};

// ----------------------------------------------------------------------

export default function BannerScore({ bar_height, player_id, team_scores, score_to_win }: Props) {

    const score_array: number[] = (getScoreArray(player_id, team_scores, score_to_win));

    const banner_dimensions = getBannerDimensions(bar_height);
    const banner_width = banner_dimensions[0];
    const banner_height = banner_dimensions[1];

    return (
        <Stack direction={'row'} spacing={banner_height * 0.0075}>
            {
                score_array.map((banner_value) => (
                    <>
                        { banner_value === 0 && <ObjectiveImg key={banner_value} player_id={-2} width={banner_width} height={banner_height}/> }
                        { banner_value === 1 && <ObjectiveImg key={banner_value} player_id={player_id} width={banner_width} height={banner_height}/> }
                        { banner_value === 2 && <KillObjectiveImg key={banner_value} player_id={player_id} width={banner_width} height={banner_height}/> }
                    </>
                ))
            }
        </Stack>
    );
}