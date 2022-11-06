import { keyframes, Stack, Typography } from '@mui/material';
import { Score } from '../../types';
import BannerScore from './BannerScore';

// ----------------------------------------------------------------------

type Props = {
    height: number,
    winner: number,
    team_scores: Score[],
    score_to_win: number,
};

// ----------------------------------------------------------------------

export default function GameFinished({ height, winner, team_scores, score_to_win }: Props) {

    const fade_in = (
        keyframes`
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }`
      );

    return (
        <Stack
            sx={{
                height: height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                animation: `${fade_in} ${2}s forwards linear`
            }}
        >
            <Typography
                variant='h5'
            >
                Congratulations on Your Victory, Player {winner + 1}!
            </Typography>
            <BannerScore bar_height={(height / 4)} player_id={winner} team_scores={team_scores} score_to_win={score_to_win} />
            <BannerScore bar_height={(height / 8)} player_id={(winner === 0 ? 1 : 0)} team_scores={team_scores} score_to_win={score_to_win} />
        </Stack>
    );
}