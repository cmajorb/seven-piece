import { Card, Stack } from '@mui/material';
import { Score } from '../../types';
import { KillObjectiveImg, ObjectiveImg } from '../misc/PNGImages';

// ----------------------------------------------------------------------

type Props = {
    team_scores: Score[],
    total_objectives: number,
    score_to_win: number,
};

// ----------------------------------------------------------------------

export default function CommandBar({ team_scores, total_objectives, score_to_win }: Props) {

    const background: string = `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`;
    const neutral_banners_num: number = total_objectives - (team_scores[0].objectives + team_scores[1].objectives);
    const minimum_kills: number = score_to_win - total_objectives;
    const neutral_banners: number[] = neutral_banners_num > 0 ? (Array.from(Array(neutral_banners_num).keys())) : [];

    const team_1_obj_banners: number[] = team_scores[0].objectives > 0 ? (Array.from(Array(team_scores[0].objectives).keys())) : [];
    const team_1_to_kill_banners: number[] = (Array.from(Array(minimum_kills - team_scores[0].kills).keys()));
    const team_1_killed_banners: number[] = team_scores[0].kills > 0 ? (Array.from(Array(team_scores[0].kills).keys())) : [];

    const team_2_obj_banners: number[] = team_scores[1].objectives > 0 ? (Array.from(Array(team_scores[1].objectives).keys())) : [];
    const team_2_to_kill_banners: number[] = (Array.from(Array(minimum_kills - team_scores[1].kills).keys()));
    const team_2_killed_banners: number[] = team_scores[1].kills > 0 ? (Array.from(Array(team_scores[1].kills).keys())) : [];

    return (
        <Stack direction={'row'} spacing={1}>
            <Card sx={{ pr: 1, pl: 1, border: 2, backgroundImage: background }}>
                <Stack direction={'row'} spacing={0.5}>
                    {team_1_to_kill_banners && team_1_to_kill_banners.map((banner) => (
                        <KillObjectiveImg key={banner} player_id={-1} width={40} height={50}/>
                    ))}
                    {team_1_killed_banners && team_1_killed_banners.map((banner) => (
                        <KillObjectiveImg key={banner} player_id={0} width={40} height={50}/>
                    ))}                
                    {team_1_obj_banners && team_1_obj_banners.map((banner) => (
                        <ObjectiveImg key={banner} player_id={0} width={40} height={50}/>              
                    ))}
                    {neutral_banners && neutral_banners.map((banner) => (
                        <ObjectiveImg key={banner} player_id={-1} width={40} height={50}/>
                    ))}
                    {team_2_obj_banners && team_2_obj_banners.map((banner) => (
                        <ObjectiveImg key={banner} player_id={1} width={40} height={50}/>
                    ))}
                    {team_2_killed_banners && team_2_killed_banners.map((banner) => (
                        <KillObjectiveImg key={banner} player_id={1} width={40} height={50}/>
                    ))}                
                    {team_2_to_kill_banners && team_2_to_kill_banners.map((banner) => (
                        <KillObjectiveImg key={banner} player_id={-1} width={40} height={50}/>
                    ))}
                </Stack>
            </Card>
            <Card sx={{ pr: 1, pl: 1, border: 2, backgroundImage: background }}>
                <Stack justifyContent={'center'} alignItems={'center'} sx={{ pt: 2 }}>
                    <ObjectiveImg player_id={-1} width={40} height={36} img_width={40} img_height={50} req_score={score_to_win}/>
                </Stack>
            </Card>
        </Stack>
    );
}