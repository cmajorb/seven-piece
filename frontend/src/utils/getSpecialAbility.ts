import { Piece, SpecialAbility } from "../types";

// ----------------------------------------------------------------------

export default function getSpecialAbility (piece: Piece | undefined, all_specials: SpecialAbility[]| undefined) {
    if (piece && all_specials) {
        for (let index in all_specials) {
            const special: SpecialAbility = all_specials[index];
            const valid_characters: string[] = special.characters;
            if (valid_characters.includes(piece.name)) { return special.name };
        }
    }
}