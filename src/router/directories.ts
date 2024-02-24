import express from "express";
import {
  getAllDirectories,
  makeDirectory,
  getDirectory,
  deleteDirectory,
} from "../controllers/directories.js";
import { isAuthenticated } from "../middlewares/index.js";
import multer from "multer";
import PdfParse from "pdf-parse";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default (router: express.Router) => {
  router.get("/dirs/getall", isAuthenticated, getAllDirectories);
  router.post("/dirs/getdir", isAuthenticated, getDirectory);
  router.post("/dirs/makedir", isAuthenticated, makeDirectory);
  router.delete("/dirs/delete", deleteDirectory);

  router.post("/dirs/pdftotext", upload.single("File"), (req, res) => {
    const file = req.file;
    PdfParse(file.buffer).then(function (data) {
      return res.json({ text: data.text });
    });
  });
};
