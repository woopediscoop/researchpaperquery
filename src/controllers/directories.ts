import express from "express";

import {
  createDirectory,
  getDirectories,
  getDirectoryById,
  deleteDirectoryById,
} from "../db/directories.js";
import { getUserBySessionToken } from "../db/users.js";
import { PineUpload } from "../scripts/pinecone.js";

import {
  createFulfilledGuideline,
  getFulfilledGuidelineByGuidelineAndDirectory,
  updateFulfilledGuidelineByGuidelineAndDirectory,
  deleteFulfilledGuidelineById,
} from "../db/directories.js";

export const noteCorrectPassage = async (
  req: express.Request,
  res: express.Response,
) => {
  const { directory, guideline, passages } = req.body;
  const correctPassage = await createFulfilledGuideline({
    passages: passages,
    Directory: directory,
    Guideline: guideline,
  });
  return res.json(correctPassage);
};

export const getCorrectPassage = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { guideline, directory } = req.body;
    const correctPassage = await getFulfilledGuidelineByGuidelineAndDirectory({
      guideline_id: guideline,
      directory_id: directory,
    });
    return res.json(correctPassage);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const makeDirectory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { index, name, description, pdfname, pdftext } = req.body;
    const pdfnameclean = pdfname.replace(/ /g, "-").slice(0, -4);
    const sessionToken = req.cookies["USER-AUTH"];
    if (!sessionToken) {
      console.log("Session Token doesn't exist");
      return res.sendStatus(400);
    }
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      console.log("User doesn't exist");
      return res.sendStatus(400);
    }

    const directories = await getDirectories();

    const nameExists = directories.some((directory) => directory.name === name);
    if (nameExists) {
      return res.json({
        error: "The name " + name + " exists already as a directory",
      });
    }
    const pdfExists = directories.some(
      (directory) => directory.pdfname === pdfnameclean,
    );
    if (pdfExists) {
      const existingDir = directories.find(
        (directory) => directory.pdfname === pdfnameclean,
      );
      return res.json({
        error:
          "The PDF " +
          pdfnameclean +
          " has already been uploaded! \nIt is under the name " +
          existingDir.name,
      });
    }

    const response = await PineUpload(index, pdfnameclean, pdftext);
    if (response.createdIndex) {
      const directory = await createDirectory({
        name: name,
        description: description,
        pdfname: pdfnameclean,
      });
      if (response.upserted) {
        return res.json(directory);
      } else {
        return res.json({
          error: "Uploading error! Create new Directory name please",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteDirectory = async (
  req: express.Request,
  res: express.Response,
) => {
  const dir = req.query.directory;
  const deletedDir = await deleteDirectoryById(dir.toString());
  return res.json({
    message: "deleted directory successfully",
    directory: deletedDir,
  });
};

export const getAllDirectories = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const directories = await getDirectories();
    return res.json(directories);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getDirectory = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const directory = await getDirectoryById(req.body.directory);
    return res.json(directory);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
