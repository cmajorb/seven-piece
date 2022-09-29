import { Stack } from '@mui/material';
import { Score } from '../../types';
import { KillObjectiveImg, ObjectiveImg } from '../misc/PNGImages';

// ----------------------------------------------------------------------

type Props = {
    team_scores: Score[],
    total_objectives: number,
    score_to_win: number,
};

// ----------------------------------------------------------------------

export default function BannerScore({ team_scores, total_objectives, score_to_win }: Props) {

    const neutral_banners_num: number = total_objectives - (team_scores[0].objectives + team_scores[1].objectives);
    const minimum_kills: number = score_to_win - total_objectives;
    const neutral_banners: number[] = neutral_banners_num > 0 ? (Array.from(Array(neutral_banners_num).keys())) : [];

    const team_1_obj_banners: number[] = team_scores[0].objectives > 0 ? (Array.from(Array(team_scores[0].objectives).keys())) : [];
    const team_1_to_kill_banners: number[] = (Array.from(Array(minimum_kills - team_scores[0].kills).keys()));
    const team_1_killed_banners: number[] = team_scores[0].kills > 0 ? (Array.from(Array(team_scores[0].kills).keys())) : [];

    const team_2_obj_banners: number[] = team_scores[1].objectives > 0 ? (Array.from(Array(team_scores[1].objectives).keys())) : [];
    const team_2_to_kill_banners: number[] = (Array.from(Array(minimum_kills - team_scores[1].kills).keys()));
    const team_2_killed_banners: number[] = team_scores[1].kills > 0 ? (Array.from(Array(team_scores[1].kills).keys())) : [];

    const banner_height = 70;
    const banner_width = banner_height * 0.8;

    return (
        <Stack direction={'row'} spacing={1.5}>
            {team_1_to_kill_banners && team_1_to_kill_banners.map((banner) => (
                <KillObjectiveImg key={banner} player_id={-1} width={banner_width} height={banner_height}/>
            ))}
            {team_1_killed_banners && team_1_killed_banners.map((banner) => (
                <KillObjectiveImg key={banner} player_id={0} width={banner_width} height={banner_height}/>
            ))}                
            {team_1_obj_banners && team_1_obj_banners.map((banner) => (
                <ObjectiveImg key={banner} player_id={0} width={banner_width} height={banner_height}/>              
            ))}
            {neutral_banners && neutral_banners.map((banner) => (
                <ObjectiveImg key={banner} player_id={-1} width={banner_width} height={banner_height}/>
            ))}
            {team_2_obj_banners && team_2_obj_banners.map((banner) => (
                <ObjectiveImg key={banner} player_id={1} width={banner_width} height={banner_height}/>
            ))}
            {team_2_killed_banners && team_2_killed_banners.map((banner) => (
                <KillObjectiveImg key={banner} player_id={1} width={banner_width} height={banner_height}/>
            ))}                
            {team_2_to_kill_banners && team_2_to_kill_banners.map((banner) => (
                <KillObjectiveImg key={banner} player_id={-1} width={banner_width} height={banner_height}/>
            ))}
        </Stack>
    );
}