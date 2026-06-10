import React from 'react';
import {
  SprayCan,
  Leaf,
  Sprout,
  Map,
  Droplets,
  FlaskConical,
  FileBarChart,
  Flame,
  Flower2,
  Wheat,
  type LucideProps,
} from 'lucide-react-native';

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  'spray-can': SprayCan,
  leaf: Leaf,
  sprout: Sprout,
  map: Map,
  droplets: Droplets,
  'flask-conical': FlaskConical,
  'file-chart-column': FileBarChart,
  flame: Flame,
  flower: Flower2,
  wheat: Wheat,
};

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export default function ServiceIcon({ name, size = 24, color = '#1A6B3C' }: Props) {
  const Cmp = MAP[name] ?? Leaf;
  return <Cmp size={size} color={color} strokeWidth={2} />;
}
