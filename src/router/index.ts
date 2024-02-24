import express from "express";
import authentication from "./authentication.js";
import pages from "./pages.js";
import users from "./users.js";
import guidelines from "./guidelines.js";
import vec from "./vec.js";
import directories from "./directories.js";

const router = express.Router();
//router.use(express.json)

export default (): express.Router => {
  authentication(router);
  users(router);
  pages(router);
  guidelines(router);
  vec(router);
  directories(router);
  return router;
};
