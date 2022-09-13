import BerserkerImg from '../images/GrumFlameblade.png';
import SoldierImg from '../images/LegionnaireAlvar.png';
import IceWizardImg from '../images/DjinnOshannus.png';
import ArcherImg from '../images/DhampirStalker.png';

// ----------------------------------------------------------------------

export default function getPieceImg (piece_name: string) {
    if (piece_name === 'Berserker') { return BerserkerImg };
    if (piece_name === 'Soldier') { return SoldierImg };
    if (piece_name === 'Ice Wizard') { return IceWizardImg };
    if (piece_name === 'Archer') { return ArcherImg };
  }