import { Player, Score } from "../types";

// ----------------------------------------------------------------------

export default function getTeamScores (players: Player[]) {
    const default_score: Score = { objectives: 0, kills: 0, total: -1 };
    const team_score_1: Score = players[0] ? players[0].score : default_score;
    const team_score_2: Score = players[1] ? players[1].score : default_score;
    return [team_score_1, team_score_2];
}