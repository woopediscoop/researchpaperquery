import express from "express";
import {
  createGuidelineSet,
  getGuidelineSets,
  deleteGuidelineSetById,
  deleteGuidelineById,
  getGuidelineById,
  createGuideline,
  getGuidelineSetById,
  updateGuidelineSet,
  updateGuideline,
} from "../db/guidelines.js";
import {
  createFulfilledGuideline,
  getFulfilledGuidelineByGuidelineAndDirectory,
  updateFulfilledGuidelineByGuidelineAndDirectory,
} from "../db/directories.js";
import { getUserBySessionToken } from "../db/users.js";

export const getAllGuidelineSets = async (
  req: express.Request,
  res: express.Response,
) => {
  const Guidelinesets = await getGuidelineSets();
  return res.json(Guidelinesets);
};

//Create a guidelineset, add name and author
export const makeGuidelineSet = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const sessionToken = req.cookies["USER-AUTH"];
    const user = await getUserBySessionToken(sessionToken);
    const { name, description } = req.body;
    if (!name) {
      console.log("noname");
      return res.sendStatus(400);
    }
    const Guidelinesets = await getGuidelineSets();
    let names = [];
    Guidelinesets.forEach((glset) => {
      names.push(glset.name);
    });
    if (names.includes(name)) {
      res.json({ error: "Name existiert bereits!" });
    }
    const GuidelineSet = await createGuidelineSet({
      name: name,
      description: description,
      Author: user.id,
    });
    return res.json(GuidelineSet);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getGuidelineSet = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { glset } = req.body;
    console.log(glset);
    const guidelineset = await getGuidelineSetById(glset);
    console.log(guidelineset);
    return res.json(guidelineset);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteGuidelineSet = async (
  req: express.Request,
  res: express.Response,
) => {
  const glset = req.query.guidelineset;

  //update guidelineset
  const guidelineset = await getGuidelineSetById(glset.toString());
  const GLIds = guidelineset.Guidelines;
  GLIds.forEach(async (gl_id) => {
    console.log(gl_id.toString());
    await deleteGuidelineById(gl_id.toString());
  });
  const deletedGuidelineSet = await deleteGuidelineSetById(glset.toString());
  return res.json({
    message: "Deleted GuidelineSet Successfully",
    guidelineset: deletedGuidelineSet,
  });
};

export const updateGuidelineSetById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id, values } = req.body;
    console.log(values);
    const updatedGuidelineSet = await updateGuideline(id, values);
    return res.json({
      message: "Updated successfully!",
      guideline: updatedGuidelineSet,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const guidelinesBySetId = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.body;
  const glset = await getGuidelineSetById(id);

  const GuidelinePromises = glset.Guidelines.map(
    async (guideline_id) => await getGuidelineById(guideline_id),
  );
  try {
    const guidelines = await Promise.all(GuidelinePromises);
    return res.json(guidelines);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const addGuidelineToSet = async (
  req: express.Request,
  res: express.Response,
) => {
  const { nr, itemToCheck, description, importance, note, GuidelineSetId } =
    req.body;

  if (!nr || !itemToCheck || !importance || !GuidelineSetId) {
    return res.json({ error: "not everything defined" });
  }

  const GLSet = await getGuidelineSetById(GuidelineSetId);
  const previousGuidelines = GLSet.Guidelines;
  console.log(previousGuidelines[1]);
  let nrs = [];
  let itemsTC = [];
  for (let i = 0; i < previousGuidelines.length; i++) {
    const gl = await getGuidelineById(previousGuidelines[i]);
    nrs.push(gl.nr);
    itemsTC.push(gl.itemToCheck);
  }
  if (nrs.includes(nr)) {
    console.log("Index " + nr + " Already exists in " + GLSet.name);
    return res.json({
      error: "Index " + nr + " Already exists in " + GLSet.name,
    });
  }
  if (itemsTC.includes(itemToCheck)) {
    console.log("Item " + itemToCheck + " already exists in " + GLSet.name);
    return res.json({
      error: "Item " + itemToCheck + " already exists in " + GLSet.name,
    });
  }

  const Guideline = await createGuideline({
    nr: nr,
    itemToCheck: itemToCheck,
    importance: importance,
    GuidelineSet: GuidelineSetId,
    description: description,
    note: note,
  });

  const GLIds = [...GLSet.Guidelines, Guideline._id.toString()];
  const updatedGLSet = await updateGuidelineSet(GLSet.id, {
    Guidelines: GLIds,
  });

  return res.json({ Guideline: Guideline, GuidelineSet: updatedGLSet });
};

export const getGuidelinesByGuidelineSet = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const GLSet = await getGuidelineSetById(req.body.guidelineset);
    const gl_ids = GLSet.Guidelines;
    let Guidelines = [];
    gl_ids.forEach(async (gl) => {
      const Guideline = await getGuidelineById(gl);
      Guidelines.push(Guideline);
    });
    Guidelines.sort((a, b) => a.nr - b.nr);
    return res.json();
  } catch (error) {}
};

export const getGuideline = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const guideline = await getGuidelineById(req.body.guideline);
    console.log(guideline);
    return res.json(guideline);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteGuideline = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const guideline = req.query.guideline;

    //update guidelineset
    const gl = await getGuidelineById(guideline.toString());
    const GLSet = await getGuidelineSetById(gl.GuidelineSet);
    const GLIds = GLSet.Guidelines.filter(
      (gl_id) => gl_id != guideline.toString(),
    );
    await updateGuidelineSet(GLSet.id, { Guidelines: GLIds });

    const deletedGuideline = await deleteGuidelineById(guideline.toString());

    return res.json({
      message: "Deleted Guideline Successfully",
      guideline: deletedGuideline,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getCurrentGLSet = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const sessionToken = req.cookies["USER-AUTH"];
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      console.log("not logged in");
      return res.sendStatus(400);
    }
    const currentGLSet = await getGuidelineSetById(user.CurrentGuidelineSet);
    return res.json(currentGLSet);
  } catch (error) {
    return res.json({ error: error });
  }
};

export const GetFulfilledGuideline = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { directory, guideline } = req.body;
    const fulfilled = await getFulfilledGuidelineByGuidelineAndDirectory({
      guideline_id: guideline,
      directory_id: directory,
    });
    if (fulfilled) {
      return res.json(fulfilled);
    } else {
      return res.json(null);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const MakeOrUpdateFulfilledGuideline = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { directory, guideline, passage, vectorquery } = req.body;
    const before = await getFulfilledGuidelineByGuidelineAndDirectory({
      guideline_id: guideline,
      directory_id: directory,
    });
    if (before) {
      if (vectorquery) {
        const lastvectorqueries = before.VectorQueries;
        let updatedvectorqueries = [];
        if (!lastvectorqueries.includes(vectorquery)) {
          updatedvectorqueries = [...lastvectorqueries, vectorquery];
        } else {
          updatedvectorqueries = lastvectorqueries;
        }
        const fulfilled = await updateFulfilledGuidelineByGuidelineAndDirectory(
          {
            guideline_id: guideline,
            directory_id: directory,
            values: {
              passages: passage,
              VectorQueries: updatedvectorqueries,
            },
          },
        );
        return fulfilled;
      } else {
        const fulfilled = await updateFulfilledGuidelineByGuidelineAndDirectory(
          {
            guideline_id: guideline,
            directory_id: directory,
            values: {
              passages: passage,
            },
          },
        );
        return fulfilled;
      }
    } else {
      const { passage, vectorquery, directory, guideline } = req.body;
      const fulfilled = await createFulfilledGuideline({
        passages: passage,
        VectorQueries: [vectorquery],
        Directory: directory,
        Guideline: guideline,
      });
      return res.json(fulfilled);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
