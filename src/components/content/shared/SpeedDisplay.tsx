interface SpeedDisplayProps {
  speed: { [key: string]: number | string };
  label?: string;
}

export default function SpeedDisplay({ speed, label = "Speed" }: SpeedDisplayProps) {
  if (!speed || Object.keys(speed).length === 0) return null;

  const formatSpeed = (type: string, value: number | string): string => {
    if (type === 'walk') {
      return `${value} ft.`;
    }
    return `${type} ${value} ft.`;
  };

  const speeds = Object.entries(speed)
    .map(([type, value]) => formatSpeed(type, value))
    .join(', ');

  return (
    <div className="detail-row">
      <strong>{label}:</strong> {speeds}
    </div>
  );
}