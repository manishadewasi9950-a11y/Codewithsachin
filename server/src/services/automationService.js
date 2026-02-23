import { formatTemplates } from "../utils/templates.js";

const keywords = {
  quiz: ["question", "answer", "guess"],
  storytelling: ["once", "story", "journey", "then"],
  motivational: ["dream", "success", "focus", "never give up"],
  comparison: ["vs", "better", "compare", "difference"]
};

const splitScript = (script) =>
  script
    .split(/\n+|(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

const detectSection = (index, total) => {
  if (index === 0) return "hook";
  if (index === total - 1) return "cta";
  return "main";
};

const estimateDuration = (text) => Math.max(2, Math.min(8, Math.ceil(text.split(" ").length / 2.4)));

export const buildProjectPlan = ({ script, format, stylePrompt, mode, assets }) => {
  const template = formatTemplates[format] || formatTemplates.storytelling;
  const lines = splitScript(script);

  const scenes = lines.map((line, index) => {
    const lower = line.toLowerCase();
    const matchedType = Object.entries(keywords).find(([, values]) =>
      values.some((keyword) => lower.includes(keyword))
    )?.[0];

    const mediaMatch = assets.media.find((file) => lower.includes(file.originalname.toLowerCase().split(".")[0]));

    return {
      id: `scene-${index + 1}`,
      section: detectSection(index, lines.length),
      text: line,
      duration: estimateDuration(line),
      media: mediaMatch?.filename || assets.media[index % Math.max(assets.media.length, 1)]?.filename || null,
      autoCaption: line,
      transition: template.transitions[index % template.transitions.length],
      animation: matchedType ? formatTemplates[matchedType]?.animationStyle || template.animationStyle : template.animationStyle,
      soundEffect: /!|\?|boom|wow|goal/i.test(line) ? "impact-hit" : null
    };
  });

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  return {
    mode,
    format,
    stylePrompt,
    template,
    scenes,
    timeline: scenes.map((scene, idx) => ({
      sceneId: scene.id,
      start: scenes.slice(0, idx).reduce((s, x) => s + x.duration, 0),
      end: scenes.slice(0, idx + 1).reduce((s, x) => s + x.duration, 0)
    })),
    captions: scenes.map((scene) => ({ sceneId: scene.id, text: scene.autoCaption })),
    totalDuration,
    renderHints: {
      syncToVoiceover: Boolean(assets.voiceover.length),
      applyAutoZoom: true,
      addTransitions: true,
      addTextAnimation: true
    }
  };
};
