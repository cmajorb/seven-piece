import { Piece, AnimationDirection } from "../../types";

export default function calcAttackDirection (attacker: Piece, defender: Piece) {
    let direction: AnimationDirection = 'center';
    if (attacker.location[0] === defender.location[0] && attacker.location[1] < defender.location[1]) {
            direction = 'right';
        } else if (attacker.location[0] === defender.location[0] && attacker.location[1] > defender.location[1]) {
            direction = 'left';
        } else if (attacker.location[0] < defender.location[0] && attacker.location[1] === defender.location[1]) {
            direction = 'up';
        } else if (attacker.location[0] > defender.location[0] && attacker.location[1] === defender.location[1]) {
            direction = 'down';
        } else if (attacker.location[0] > defender.location[0] && attacker.location[1] < defender.location[1]) {
            direction = 'down-right';
        } else if (attacker.location[0] > defender.location[0] && attacker.location[1] > defender.location[1]) {
            direction = 'down-left';
        } else if (attacker.location[0] < defender.location[0] && attacker.location[1] > defender.location[1]) {
            direction = 'up-left';
        } else if (attacker.location[0] < defender.location[0] && attacker.location[1] < defender.location[1]) {
            direction = 'up-right';
        }
    return direction;
};