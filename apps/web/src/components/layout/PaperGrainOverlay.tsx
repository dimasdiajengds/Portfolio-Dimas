export function PaperGrainOverlay() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.42 0 0 0 0 0.38 0 0 0 0.22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;

  return (
    <div
      aria-hidden="true"
      className="paper-grain"
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
      }}
    />
  );
}
