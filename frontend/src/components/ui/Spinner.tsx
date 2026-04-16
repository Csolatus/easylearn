type Props = { color?: string };

export default function Spinner({ color = "border-purple-500" }: Props) {
  return (
    <div className={`w-6 h-6 border-2 ${color} border-t-transparent rounded-full animate-spin`} />
  );
}
