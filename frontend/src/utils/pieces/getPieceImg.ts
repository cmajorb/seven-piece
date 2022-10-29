import BerserkerImg from '../images/GrumFlameblade.png';
import SoldierImg from '../images/LegionnaireAlvar.png';
import IceWizardImg from '../images/DjinnOshannus.png';
import ArcherImg from '../images/DhampirStalker.png';
import ScoutImg from '../images/DumackeExile.png';
import ClericImg from '../images/Revealer.png';
import WerewolfImg from '../images/Vulguine.png';

// ----------------------------------------------------------------------

export default function getPieceImg (piece_name: string) {
    if (piece_name === 'Berserker') { return BerserkerImg };
    if (piece_name === 'Soldier') { return SoldierImg };
    if (piece_name === 'Ice Wizard') { return IceWizardImg };
    if (piece_name === 'Archer') { return ArcherImg };
    if (piece_name === 'Scout') { return ScoutImg };
    if (piece_name === 'Cleric') { return ClericImg };
    if (piece_name === 'Werewolf') { return WerewolfImg };
  }