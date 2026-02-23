export const formatTemplates = {
  quiz: {
    label: "Quiz",
    animationStyle: "fast cuts + countdown",
    transitions: ["flash", "swipe"],
    textLayout: "center bold with answer reveal"
  },
  challenge: {
    label: "Guess the Player / Challenge",
    animationStyle: "zoom punches + suspense",
    transitions: ["zoom", "glitch"],
    textLayout: "upper question + lower hints"
  },
  topList: {
    label: "Top 5 / Top 10",
    animationStyle: "beat sync + rank pop",
    transitions: ["slide", "cut"],
    textLayout: "big number + subtitle"
  },
  storytelling: {
    label: "Storytelling",
    animationStyle: "cinematic pans",
    transitions: ["fade", "cross dissolve"],
    textLayout: "subtitles lower-third"
  },
  motivational: {
    label: "Motivational",
    animationStyle: "slow zoom + punch words",
    transitions: ["fade", "impact cut"],
    textLayout: "word-by-word center"
  },
  comparison: {
    label: "Comparison",
    animationStyle: "split screen",
    transitions: ["wipe", "cut"],
    textLayout: "left vs right labels"
  }
};

export const aspectRatios = {
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 }
};
