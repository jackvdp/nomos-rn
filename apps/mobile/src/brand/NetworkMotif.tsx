import Svg, { Circle, G, Line, Polygon } from 'react-native-svg';

// Drawn in a box this many units across, then scaled to the size asked for.
const box = 200;
const centre = box / 2;
const outerRadius = 92;
const innerRadius = 46;

interface Point {
  x: number;
  y: number;
}

/** `count` points spaced evenly round a circle, the first at the top. */
function ring(radius: number, count: number): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
    return { x: centre + radius * Math.cos(angle), y: centre + radius * Math.sin(angle) };
  });
}

const outer = ring(outerRadius, 12);
const inner = ring(innerRadius, 6);
const outline = (points: Point[]) => points.map(({ x, y }) => `${x},${y}`).join(' ');

export interface NetworkMotifProps {
  /** Width and height. */
  size: number;
  color: string;
}

/**
 * The ring of connected nodes from the NOMOS logo, as line art to sit behind
 * other content. It is decoration: hide it from screen readers where it is used.
 */
export function NetworkMotif({ size, color }: NetworkMotifProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${box} ${box}`}>
      <G fill="none" stroke={color} strokeWidth={0.5}>
        <Polygon points={outline(outer)} />
        <Polygon points={outline(inner)} />
        {outer.map(({ x, y }, index) => (
          <Line key={index} x1={centre} y1={centre} x2={x} y2={y} />
        ))}
        <Circle cx={centre} cy={centre} r={9} />
      </G>
      <G fill={color}>
        {/* Larger and smaller nodes alternate, as they do in the logo. */}
        {outer.map(({ x, y }, index) => (
          <Circle key={index} cx={x} cy={y} r={index % 2 ? 1 : 1.6} />
        ))}
        <Circle cx={centre} cy={centre} r={4} />
      </G>
    </Svg>
  );
}
