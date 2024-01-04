import { createVectorQuery, getVectorQueriesByGuideline, updateVectorQueryById, deleteVectorQueryById, getVectorQueryById, queryVectorQueries } from '../db/vectorqueries.js';
import { QueryPine } from '../scripts/pinecone.js';
import { getDirectoryById } from '../db/directories.js';
import { getUserBySessionToken } from '../db/users.js';
export const evaluateQuery = async (req, res) => {
    try {
        const { query_id, containsCorrectPassage, passage_nr, note, name } = req.body;
        const updatedQuery = await updateVectorQueryById(query_id, {
            containsCorrectPassage: containsCorrectPassage,
            passageNr: (containsCorrectPassage ? passage_nr : null),
            note: note,
            name: name
        });
        return res.json(updatedQuery);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const findQueries = async (req, res) => {
    try {
        const { guideline, directory, name, successful, personal } = req.body;
        console.log("guideline: " + guideline + " directory: " + directory + " name: " + name + " successful: " + successful + " personal: " + personal);
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            user._id;
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        let query = {};
        if (guideline) {
            query.Guideline = guideline;
        }
        if (directory) {
            query.Directory = directory;
        }
        if (name) {
            query.name = name;
        }
        if (successful) {
            query.containsCorrectPassage = successful;
        }
        if (user && personal) {
            query.User = user.id;
        }
        console.log(query);
        const queries = await queryVectorQueries(query);
        console.log(queries);
        return res.json(queries);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const getVectoryQuery = async (req, res) => {
    try {
        const query = await getVectorQueryById(req.body.vectorquery);
        return res.json(query);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const makeVectorQuery = async (req, res) => {
    try {
        const { prompt, guideline, directory, name } = req.body;
        if (!prompt || !guideline || !directory) {
            console.log("no Prompt, Guideline or Directory");
            return res.sendStatus(400);
        }
        const sessionToken = req.cookies['USER-AUTH'];
        const user = await getUserBySessionToken(sessionToken);
        const dir = await getDirectoryById(directory);
        console.log("dirname: " + dir.name + " prompt: " + prompt);
        const matches = await QueryPine('pdfsearch', dir.pdfname, prompt);
        const results = matches.map((match) => match.metadata.text);
        const VecQuery = await createVectorQuery({
            prompt: prompt,
            name: name,
            results: results,
            User: user.id,
            Guideline: guideline,
            Directory: directory,
        });
        console.log(VecQuery);
        res.json(VecQuery);
    }
    catch (error) {
        return res.json({ error: error });
    }
};
export const deleteQuery = async (req, res) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        const user = await getUserBySessionToken(sessionToken);
        //if(getQuery.User != user.id){
        if (false) {
            return res.json({ message: "You are not authorized to delete this query" });
        }
        else {
            const queryId = req.query.vectorquery;
            const deletedquery = await deleteVectorQueryById(queryId.toString());
            console.log("#DEL: " + deletedquery);
            return res.json({ query: deletedquery, message: "Query deleted" });
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const getQueriesByGuideline = async (req, res) => {
    try {
        const guideline = req.body.guideline;
        const queries = await getVectorQueriesByGuideline(guideline);
        return res.json(queries);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=vectorqueries.js.map