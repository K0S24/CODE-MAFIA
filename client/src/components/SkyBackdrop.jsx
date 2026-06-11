import '../styles/pixel.css';

/*
 * Decorative layer for the sky-* screens: optional moon, drifting clouds,
 * twinkling sparkles. Lives inside the .sky-clouds stacking layer so all
 * decor sits behind the screen content and above the sky gradient.
 *
 * clouds:   [{ w, h, top, drift (s), delay (s, negative = scattered phase) }]
 * sparkles: [{ top, left/right, animationDelay? }]  (plain style objects)
 * moon:     style object with position, or omitted
 */
export default function SkyBackdrop({ moon, clouds = [], sparkles = [] }) {
  return (
    <div className="sky-clouds">
      {moon && <div className="pixel-moon" style={moon} />}
      {clouds.map((c, i) => (
        <div
          key={`cloud-${i}`}
          className="pixel-cloud"
          style={{
            width: c.w,
            height: c.h,
            top: c.top,
            animation: `cloud-drift ${c.drift}s linear infinite`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
      {sparkles.map((s, i) => (
        <div key={`sparkle-${i}`} className="pixel-sparkle" style={s} />
      ))}
    </div>
  );
}
