import express from 'express';
import { createGuidelineSet, getGuidelineSets, deleteGuidelineSetById, deleteGuidelineById, getGuidelineById, createGuideline, getGuidelineSetById, updateGuidelineSet } from '../db/guidelines.js';
import { getUserBySessionToken } from '../db/users.js';


export const getAllGuidelineSets = async (req: express.Request, res: express.Response) => {
    const Guidelinesets = await getGuidelineSets();
    return res.json(Guidelinesets);
}

//Create a guidelineset, add name and author
export const makeGuidelineSet = async (req: express.Request, res: express.Response) => {
    const { name } = req.body;
    if(!name){
        console.log("noname")
        return res.sendStatus(400);
    }
    const Guidelinesets = await getGuidelineSets();
    let names =[];
    Guidelinesets.forEach((glset) => {
        names.push(glset.name);
    })
    if(names.includes(name)){
        console.log("Der Name existiert bereits");
        return res.sendStatus(400);
    }
    const GuidelineSet = await createGuidelineSet({
        name:name
    });
    return res.json(GuidelineSet)
}

export const deleteGuidelineSet = async (req: express.Request, res: express.Response) => {
    const {id} = req.body;
    const gset = await getGuidelineSetById(id);
    const guidelineids = gset.Guidelines;

    const glDeletePromises = gset.Guidelines.map(gl_id => deleteGuidelineById(gl_id))

    const deletedGuidelines = await Promise.all(glDeletePromises)
    const deletedgset = await deleteGuidelineSetById(id);
    return res.json({
        DeletedGLSet:deletedgset,
        deletedGuidelines:deletedGuidelines
    });
        
}

export const guidelinesBySetId = async (req: express.Request, res: express.Response) => {
    const {id} = req.body;
    const glset = await getGuidelineSetById(id);

    const GuidelinePromises = glset.Guidelines.map(guideline_id => getGuidelineById(guideline_id));
    try{
        const guidelines = await Promise.all(GuidelinePromises);
        return res.json(guidelines);
    }
    catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}

export const addGuidelineToSet = async (req: express.Request, res: express.Response) => {
    const {nr, itemToCheck, description, importance, note, GuidelineSetId} = req.body;
   
    if(!nr || !itemToCheck || !importance || !GuidelineSetId){
        console.log("nr, itemtocheck importance or guidelineset missing!")
        return res.sendStatus(400);
    }

    const GLSet = await getGuidelineSetById(GuidelineSetId);
    const previousGuidelines = GLSet.Guidelines;
    console.log(previousGuidelines[1])
    let nrs = [];
    let itemsTC = [];
    for(let i = 0; i < previousGuidelines.length; i++){
        const gl = await getGuidelineById(previousGuidelines[i]);
        nrs.push(gl.nr)
        itemsTC.push(gl.itemToCheck);
    }
    if(nrs.includes(nr)){
        console.log("Index "+nr+" Already exists in "+GLSet.name);
        return res.send("Index "+nr+" Already exists in "+GLSet.name)
    }
    if(itemsTC.includes(itemToCheck)){
        console.log("Item "+itemToCheck+" already exists in "+GLSet.name);
        return res.sendStatus(400);
    }

    const Guideline = await createGuideline({
        nr:nr,
        itemToCheck:itemToCheck,
        importance:importance,
        GuidelineSet:GuidelineSetId,
        description:description,
        note:note
    });
    
    const GLIds = [...GLSet.Guidelines, Guideline._id.toString()];
    const updatedGLSet = await updateGuidelineSet(GLSet.id,{Guidelines:GLIds})

    return res.json({Guideline:Guideline,
        GuidelineSet:updatedGLSet});
}

export const getGuidelinesByGuidelineSet = async (req: express.Request, res: express.Response) => {

}