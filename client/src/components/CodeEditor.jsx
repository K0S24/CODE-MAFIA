import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, players, myId }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 12px', background: '#1e1e1e', borderBottom: '1px solid #333', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ color: '#fff', fontSize: '12px' }}>CODE EDITOR – PYTHON</span>
        {players?.map((p) => (
          <span key={p.id} style={{ color: p.color, fontSize: '11px' }}>
            ■ {p.username}{p.id === myId ? ' (YOU)' : ''}
          </span>
        ))}
      </div>
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={onChange}
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
