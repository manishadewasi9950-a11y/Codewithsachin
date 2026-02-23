import { useEffect, useMemo, useState } from 'react';
import api from './lib/api';
import SectionCard from './components/SectionCard';
import TimelineEditor from './components/TimelineEditor';
import PreviewPlayer from './components/PreviewPlayer';

const formatOptions = [
  { value: 'quiz', label: 'Quiz format' },
  { value: 'challenge', label: 'Guess the player / challenge' },
  { value: 'topList', label: 'Top 5 / Top 10' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'motivational', label: 'Motivational reel' },
  { value: 'comparison', label: 'Comparison' }
];

export default function App() {
  const [mode, setMode] = useState('auto');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [format, setFormat] = useState('quiz');
  const [script, setScript] = useState('Hook: Do you know this football legend?\nMain: Here are 3 clues for you.\nCTA: Comment your answer.');
  const [stylePrompt, setStylePrompt] = useState('quiz + fast cuts + big bold captions');
  const [templates, setTemplates] = useState({});
  const [files, setFiles] = useState({ images: [], clips: [], voiceover: [], music: [], background: [] });
  const [projectPlan, setProjectPlan] = useState(null);
  const [renderUrl, setRenderUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/templates').then((res) => setTemplates(res.data.templates));
  }, []);

  const onFileChange = (key, list) => setFiles((prev) => ({ ...prev, [key]: Array.from(list) }));

  const generateProject = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('mode', mode);
    formData.append('aspectRatio', aspectRatio);
    formData.append('format', format);
    formData.append('script', script);
    formData.append('stylePrompt', stylePrompt);

    Object.entries(files).forEach(([key, selected]) => selected.forEach((file) => formData.append(key, file)));

    const res = await api.post('/project/generate', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setProjectPlan(res.data.projectPlan);
    setLoading(false);
  };

  const renderVideo = async () => {
    if (!projectPlan) return;
    setLoading(true);
    const res = await api.post('/project/render', { projectPlan });
    setRenderUrl(`http://localhost:4000${res.data.output}`);
    setLoading(false);
  };

  const updateDuration = (sceneId, duration) => {
    setProjectPlan((prev) => {
      if (!prev) return prev;
      const scenes = prev.scenes.map((scene) => (scene.id === sceneId ? { ...scene, duration } : scene));
      return { ...prev, scenes, totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0) };
    });
  };

  const selectedTemplate = useMemo(() => templates[format], [templates, format]);

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-6">
          <h1 className="text-2xl font-bold md:text-4xl">AI Auto Video Maker</h1>
          <p className="mt-1 text-sm text-indigo-50">Create Shorts, Reels & YouTube videos in one click with AI automation.</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <SectionCard title="1) Creation Setup">
              <div className="grid gap-3 md:grid-cols-3">
                <select className="rounded-lg bg-slate-900 p-2" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="auto">Auto Mode</option>
                  <option value="manual">Manual Mode</option>
                </select>
                <select className="rounded-lg bg-slate-900 p-2" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                  <option value="9:16">9:16 (Shorts/Reels)</option>
                  <option value="16:9">16:9 (YouTube)</option>
                  <option value="1:1">1:1 (Instagram)</option>
                </select>
                <select className="rounded-lg bg-slate-900 p-2" value={format} onChange={(e) => setFormat(e.target.value)}>
                  {formatOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <textarea className="mt-3 h-36 w-full rounded-lg bg-slate-900 p-3" value={script} onChange={(e) => setScript(e.target.value)} placeholder="Paste your script" />
              <input className="mt-3 w-full rounded-lg bg-slate-900 p-3" value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)} placeholder="Reference style prompt" />
            </SectionCard>

            <SectionCard title="2) Uploads (drag & drop enabled by browser)">
              <div className="grid gap-3 md:grid-cols-2">
                {['images', 'clips', 'voiceover', 'music', 'background'].map((key) => (
                  <label key={key} className="rounded-lg border border-dashed border-slate-700 p-3 text-sm">
                    <span className="mb-2 block capitalize">{key}</span>
                    <input type="file" multiple={key === 'images' || key === 'clips'} onChange={(e) => onFileChange(key, e.target.files)} />
                    <p className="mt-2 text-xs text-slate-400">{files[key].length} file(s) selected</p>
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="3) Timeline / Editor">
              {projectPlan ? <TimelineEditor scenes={projectPlan.scenes} onDurationChange={updateDuration} /> : <p className="text-slate-400">Generate project to unlock timeline editor.</p>}
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Preview & Export">
              <PreviewPlayer renderUrl={renderUrl} projectPlan={projectPlan} />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={generateProject} className="rounded-lg bg-cyan-500 p-2 font-semibold text-slate-950 disabled:opacity-60" disabled={loading}>
                  {loading ? 'Working...' : 'Generate Plan'}
                </button>
                <button onClick={renderVideo} className="rounded-lg bg-indigo-500 p-2 font-semibold disabled:opacity-60" disabled={loading || !projectPlan}>
                  One-click Render
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Smart Format Template">
              {selectedTemplate ? (
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><b>Animation:</b> {selectedTemplate.animationStyle}</li>
                  <li><b>Transitions:</b> {selectedTemplate.transitions.join(', ')}</li>
                  <li><b>Text layout:</b> {selectedTemplate.textLayout}</li>
                </ul>
              ) : <p className="text-sm text-slate-400">Loading template metadata...</p>}
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
