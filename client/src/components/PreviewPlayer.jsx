export default function PreviewPlayer({ renderUrl, projectPlan }) {
  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-700 bg-black">
        {renderUrl ? (
          <video controls src={renderUrl} className="h-full w-full" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">Render preview appears here</div>
        )}
      </div>
      {projectPlan && (
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="rounded-lg bg-slate-900 p-2">Scenes: {projectPlan.scenes.length}</div>
          <div className="rounded-lg bg-slate-900 p-2">Duration: {projectPlan.totalDuration}s</div>
          <div className="rounded-lg bg-slate-900 p-2">Format: {projectPlan.format}</div>
        </div>
      )}
    </div>
  );
}
