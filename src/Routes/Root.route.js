import { Router } from "express";
import path from "path";
import { userRouter } from "./../modules/User/user.routes.js";
import { authRouter } from "./../modules/Auth/auth.route.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));
});

export { rootRouter, userRouter, authRouter };
