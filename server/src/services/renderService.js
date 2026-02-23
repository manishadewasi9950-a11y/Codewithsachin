import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { v4 as uuid } from "uuid";
import { aspectRatios } from "../utils/templates.js";

export const renderVideo = ({ projectPlan, uploadsDir, rendersDir }) =>
  new Promise((resolve, reject) => {
    if (!projectPlan.scenes.length) {
      reject(new Error("No scenes available to render."));
      return;
    }

    const size = aspectRatios[projectPlan.aspectRatio] || aspectRatios["9:16"];
    const firstScene = projectPlan.scenes.find((scene) => scene.media);

    if (!firstScene) {
      reject(new Error("No media available for render. Upload at least one image or video clip."));
      return;
    }

    const inputPath = path.join(uploadsDir, firstScene.media);
    const outputName = `${uuid()}.mp4`;
    const outputPath = path.join(rendersDir, outputName);

    ffmpeg(inputPath)
      .videoFilters([
        `scale=${size.width}:${size.height}:force_original_aspect_ratio=increase`,
        `${projectPlan.aspectRatio === "9:16" ? "crop=1080:1920" : "crop=in_w:in_h"}`
      ])
      .outputOptions([
        "-t 8",
        "-r 30",
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        "-c:v libx264",
        "-preset veryfast"
      ])
      .on("end", () => resolve(outputName))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
