import { Score } from "../types";

// ----------------------------------------------------------------------

export function getScoreArray(this_player_id: number, team_scores: Score[], score_to_win: number) {
    const kills: number[] = (Array.from(Array(team_scores[this_player_id].kills).keys())).fill(2);
    const objectives: number[] = (Array.from(Array(team_scores[this_player_id].objectives).keys())).fill(1);
    const scored_banners: number[] = kills.concat(objectives);
    const neutral_banners: number[] = (Array.from(Array(score_to_win - scored_banners.length).keys())).fill(0);
    const score_array: number[] = scored_banners.concat(neutral_banners);
    if (this_player_id === 1) { score_array.reverse() };
    return score_array;
}