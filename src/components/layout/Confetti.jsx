const COLORS = ['#2563eb', '#ef4444', '#facc15', '#22c55e', '#a855f7'];

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildPiece(i) {
  return {
    id: i,
    left: seededRandom(i) * 100,
    color: COLORS[Math.floor(seededRandom(i + 100) * COLORS.length)],
    delay: seededRandom(i + 200) * 0.4,
    duration: 2.2 + seededRandom(i + 300) * 1.2,
    rotate: seededRandom(i + 400) * 360,
    size: 6 + seededRandom(i + 500) * 6,
  };
}

export default function Confetti({ pieceCount = 60, reduceMotion = false }) {
  if (reduceMotion) return null;


  const pieces = Array.from({ length: pieceCount }, (_, i) => buildPiece(i));

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}