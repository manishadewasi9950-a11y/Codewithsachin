import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";
import { buildProjectPlan } from "./services/automationService.js";
import { renderVideo } from "./services/renderService.js";
import { formatTemplates } from "./utils/templates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");
const rendersDir = path.resolve(__dirname, "../renders");

[uploadsDir, rendersDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${uuid()}-${file.originalname.replace(/\s+/g, "-")}`)
});

const upload = multer({ storage });
const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use("/renders", express.static(rendersDir));

let latestProject = null;

app.get("/api/templates", (_req, res) => {
  res.json({ templates: formatTemplates });
});

app.post(
  "/api/project/generate",
  upload.fields([
    { name: "images", maxCount: 30 },
    { name: "clips", maxCount: 30 },
    { name: "voiceover", maxCount: 1 },
    { name: "music", maxCount: 1 },
    { name: "background", maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const files = req.files || {};
      const assets = {
        media: [...(files.images || []), ...(files.clips || [])],
        voiceover: files.voiceover || [],
        music: files.music || [],
        background: files.background || []
      };

      const projectPlan = buildProjectPlan({
        script: req.body.script || "",
        format: req.body.format || "storytelling",
        stylePrompt: req.body.stylePrompt || "",
        mode: req.body.mode || "auto",
        assets
      });

      projectPlan.aspectRatio = req.body.aspectRatio || "9:16";
      projectPlan.assets = {
        media: assets.media.map((f) => f.filename),
        voiceover: assets.voiceover.map((f) => f.filename),
        music: assets.music.map((f) => f.filename),
        background: assets.background.map((f) => f.filename)
      };

      latestProject = projectPlan;
      res.json({ projectPlan });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.post("/api/project/render", async (req, res) => {
  try {
    const projectPlan = req.body.projectPlan || latestProject;
    if (!projectPlan) {
      return res.status(400).json({ error: "No generated project found." });
    }

    const outputName = await renderVideo({ projectPlan, uploadsDir, rendersDir });
    res.json({
      message: "Render complete",
      output: `/renders/${outputName}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
