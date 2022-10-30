import { AnimationDirection, AnimationType, Piece } from "../../types";
import { keyframes } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function getPieceAnimation (piece: Piece, initiator: Piece | undefined, recipient: Piece | undefined, direction: AnimationDirection, type: AnimationType, is_turn: boolean) {
    let left = (direction === 'left' || direction === 'down-left' || direction === 'up-left') ? true : false;
    let down = (direction === 'down' || direction === 'down-left' || direction === 'down-right') ? true : false;

    const no_animation = (keyframes`0% { margin-top: 0%; } 100% { margin-top: 0%; }`);

    const take_damage = (
        keyframes`
        0% { opacity: 100%; scale: 1; }
        33% { transform: rotate(-5deg) translate(5%); }
        50% { transform: rotate(5deg) translate(-5%); opacity: 50%; scale: 0.9; }
        66% { transform: rotate(-5deg) translate(5%); }
        100% { opacity: 100%; scale: 1; }`
    );

    const attack_left_right = (
        keyframes`
        0% { margin-top: 2%; transform: rotate(${30 * (left ? -1 : 1)}deg); }
        20% { margin-top: 0%; transform: translate(${85 * (left ? -1 : 1)}%) rotate(${30 * (left ? 1 : -1)}deg); }
        80% { margin-top: 2%; transform: translate(${10 * (left ? 1 : -1)}%) rotate(${10 * (left ? -1 : 1)}deg); }
        100% { margin-top: 0%; transform: translate(0%); }`
    );
    
    const attack_up_down = (
        keyframes`
        0% { margin-top: 0%; transform: rotate(${30 * (down ? -1 : 1)}deg); }
        20% { margin-top: ${6 * (down ? 1 : -1)}%; transform: rotate(${30 * (down ? 1 : -1)}deg); }
        80% { margin-top: ${2 * (down ? -1 : 1)}%; transform: rotate(${10 * (down ? -1 : 1)}deg); }
        100% { margin-top: 0%; }`
    );
    
    const attack_up_down_left = (
        keyframes`
        0% { margin-top: 0%; transform: translate(${10 * (down ? 1 : -1)}%) rotate(${30 * (down ? -1 : 1)}deg); }
        20% { margin-top: ${7 * (down ? 1 : -1)}%; transform: translate(-75%) rotate(-30deg); }
        80% { margin-top: ${2 * (down ? -1 : 1)}%; transform: rotate(10deg); }
        100% { margin-top: 0%; }`
    );
    
    const attack_up_down_right = (
        keyframes`
        0% { margin-top: 0%; transform: translate(${10 * (down ? 1 : -1)}%) rotate(${30 * (down ? -1 : 1)}deg); }
        20% { margin-top: ${7 * (down ? 1 : -1)}%; transform: translate(75%) rotate(30deg); }
        80% { margin-top: ${2 * (down ? -1 : 1)}%; transform: rotate(-10deg); }
        100% { margin-top: 0%; }`
    );

    if (is_turn && initiator && initiator.id === piece.id) {
        if (type === 'melee attack') {
            if (direction === 'left' || direction === 'right') { return attack_left_right }
            else if (direction === 'down' || direction === 'up') { return attack_up_down }
            else if (direction === 'down-right' || direction === 'up-right') { return attack_up_down_right }
            else if (direction === 'down-left' || direction === 'up-left') { return attack_up_down_left }
            else { return no_animation };            
        } else { return no_animation };
    } else if (recipient && recipient.id === piece.id) {
        return take_damage;
    } else { return no_animation };
  };