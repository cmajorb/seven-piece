export default function calcSelectedTile (selected_tile: number[], current_tile: number[]) {
    if ((selected_tile[0] === current_tile[0]) && (selected_tile[1] === current_tile[1])) { return true }
    else { return false }
}