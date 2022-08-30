type Props = {
  status: number,
  length: number,
  row: number,
  column: number,
  fillColor: string,
  strokeColor: string,
};

export default function renderCell({ status, length, row, column, fillColor, strokeColor }: Props) {
    return (
    <rect width={length}
          height={length}
          x={length * row}
          y={length * column}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"/>
  );
}