import '../styles/pixel.css';

export default function ResultScreen({ winner, imposter, players, onPlayAgain }) {
  const imposterPlayer = players?.find((p) => p.id === imposter);
  const civiliansWon = winner === 'civilians';

  return (
    <div className="screen">
      <h1 className="pixel-title bounce" style={{ color: civiliansWon ? '#44CC44' : '#FF4444', marginBottom: '16px' }}>
        {civiliansWon ? 'CIVILIANS WIN!' : 'IMPOSTER WINS!'}
      </h1>
      <p style={{ fontSize: '8px', color: '#888', marginBottom: '32px' }}>
        {civiliansWon ? 'THE IMPOSTER WAS CAUGHT!' : 'THE IMPOSTER ESCAPED!'}
      </p>

      {imposterPlayer && (
        <div className="pixel-panel" style={{ maxWidth: '360px', textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '8px', color: '#888', marginBottom: '12px' }}>THE IMPOSTER WAS</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '14px', height: '14px', background: imposterPlayer.color, border: '3px solid #000' }} />
            <span style={{ fontSize: '14px', color: imposterPlayer.color }}>{imposterPlayer.username}</span>
          </div>
        </div>
      )}

      <button className="pixel-btn pixel-btn-yellow" style={{ fontSize: '11px' }} onClick={onPlayAgain}>
        PLAY AGAIN
      </button>
    </div>
  );
}
