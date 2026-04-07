import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, players, myId, playerCursors, onCursorChange }) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  // Inject per-player CSS for line highlights
  useEffect(() => {
    if (!players) return;
    let style = document.getElementById('player-cursor-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'player-cursor-styles';
      document.head.appendChild(style);
    }
    style.textContent = players
      .filter((p) => p.id !== myId)
      .map(
        (p) =>
          `.player-line-${p.id.replace(/[^a-z0-9]/gi, '')} { background: ${p.color}33 !important; border-left: 3px solid ${p.color} !important; }`
      )
      .join('\n');
  }, [players, myId]);

  // Update Monaco decorations when cursors change
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !playerCursors) return;

    const newDecorations = Object.entries(playerCursors)
      .filter(([uid]) => uid !== myId)
      .map(([uid, line]) => ({
        range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
        options: {
          isWholeLine: true,
          className: `player-line-${uid.replace(/[^a-z0-9]/gi, '')}`,
        },
      }));

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [playerCursors, myId]);

  function handleMount(editor) {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange?.(e.position.lineNumber);
    });
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 12px', background: '#1e1e1e', borderBottom: '1px solid #333', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ color: '#fff', fontSize: '12px' }}>CODE EDITOR – PYTHON</span>
        {players?.map((p) => (
          <span key={p.id} style={{ color: p.color, fontSize: '11px' }}>
            ■ {p.username}{p.id === myId ? ' (YOU)' : ''}
            {p.id !== myId && playerCursors?.[p.id] ? ` · L${playerCursors[p.id]}` : ''}
          </span>
        ))}
      </div>
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={onChange}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          cursorStyle: 'block',
          cursorBlinking: 'blink',
        }}
      />
    </div>
  );
}
