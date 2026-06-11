import SkyBackdrop from './SkyBackdrop';
import '../styles/pixel.css';

export default function ResultScreen({ winner, imposter, players, tie, onPlayAgain }) {
  const imposterPlayer = players?.find((p) => p.id === imposter);
  const civiliansWon = winner === 'civilians';

  return (
    <div className="screen sky-screen sky-night">
      <SkyBackdrop
        moon={{ top: '8%', right: '14%' }}
        clouds={[
          { w: 90, h: 30, top: '20%', drift: 44, delay: -10 },
          { w: 64, h: 24, top: '36%', drift: 56, delay: -30 },
        ]}
        sparkles={[
          { top: '15%', left: '18%' },
          { top: '28%', left: '40%', animationDelay: '-1.1s' },
          { top: '12%', left: '60%', animationDelay: '-0.5s' },
          { top: '34%', right: '8%', animationDelay: '-1.7s' },
        ]}
      />
      <h1 className="pixel-title pixel-title-3d bounce" style={{ color: civiliansWon ? '#44CC44' : '#FF4444', marginBottom: '16px' }}>
        {civiliansWon ? 'CIVILIANS WIN!' : 'IMPOSTER WINS!'}
      </h1>
      <p style={{ fontSize: '8px', color: '#aab0d8', marginBottom: '32px', textShadow: '2px 2px 0 #000' }}>
        {civiliansWon ? 'THE IMPOSTER WAS CAUGHT!' : tie ? 'THE VOTE WAS TIED!' : 'THE IMPOSTER ESCAPED!'}
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
