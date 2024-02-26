import express from 'express';
import multer from 'multer';
import PdfParse from 'pdf-parse';

import { getCurrentGLSet } from '../controllers/guidelines.js';
import {
    getAllUsers, getCurrentNamespaceBySessionToken, getCurrentUser, getNamespacesBySessionToken,
    postNamespaceBySessionToken, promptQuery, selectNamespaceBySessionToken, updateUserCurrentGLSet,
    vectorQuery
} from '../controllers/users.js';
import { deleteUser, existsNamespace, isAuthenticated } from '../middlewares/index.js';
import { PineUpload, QueryPine } from '../scripts/pinecone.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const index_name = "pdfsearch";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/getuser", isAuthenticated, getCurrentUser);
  router.post("/users/updatenamespaces", postNamespaceBySessionToken);
  router.post("/users/updatecurrentnamespace", selectNamespaceBySessionToken);
  router.post("/users/updatecurrentglset", updateUserCurrentGLSet);
  router.get("/users/getcurrentglset", getCurrentGLSet);

  router.get("/users/getnamespaces", getNamespacesBySessionToken);
  router.get("/users/getcurrentnamespace", getCurrentNamespaceBySessionToken);
  router.delete("/users/:id", deleteUser);

  router.post("/vecsearch", vectorQuery);
  router.post("/promptquery", promptQuery);
  router.post("/postpdf", upload.single("File"), (req, res) => {
    const file = req.file;
    const namespace = req.body.namespace;
    console.log("File", file);
    console.log("namespace", namespace);
    PdfParse(file.buffer).then(function (data) {
      const success = PineUpload(index_name, namespace, data.text);
      if (success) {
        return res.json({
          success: true,
        });
      }
    });
  });
};
