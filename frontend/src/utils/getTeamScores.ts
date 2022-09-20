import { Player } from "../types";

// ----------------------------------------------------------------------

export default function getTeamScores (players: Player[]) {
    let team_score_1: number = players[0] ? players[0].score.total : -1;
    let team_score_2: number = players[1] ? players[1].score.total : -1;
    return [team_score_1, team_score_2];
}