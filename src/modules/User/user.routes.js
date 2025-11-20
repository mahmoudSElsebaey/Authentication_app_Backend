import { Router } from "express";
import * as us from "./user.controller.js";
import { verifyJwt } from "../../middlewares/verifyJwt.js";

export const userRouter = Router();

userRouter.get("/",verifyJwt, us.getAllUsers);




// userRouter.post("/", us.getAllUsers);
// userRouter.patch("/:id", us.getAllUsers);
// userRouter.delete("/:id", us.getAllUsers);


