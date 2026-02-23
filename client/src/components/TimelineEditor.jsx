export default function TimelineEditor({ scenes, onDurationChange }) {
  return (
    <div className="space-y-3">
      {scenes.map((scene, index) => (
        <div key={scene.id} className="rounded-xl border border-slate-700 p-3">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>{index + 1}. {scene.section.toUpperCase()}</span>
            <span className="text-xs text-slate-400">{scene.transition}</span>
          </div>
          <p className="mb-3 text-sm">{scene.text}</p>
          <label className="text-xs text-slate-400">Duration (sec)</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1"
            type="range"
            min="2"
            max="12"
            value={scene.duration}
            onChange={(e) => onDurationChange(scene.id, Number(e.target.value))}
          />
          <div className="text-right text-xs text-cyan-400">{scene.duration}s</div>
        </div>
      ))}
    </div>
  );
}
