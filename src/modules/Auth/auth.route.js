import { Router } from "express";
import { login, logout, refresh, register } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh", refresh);
authRouter.post("/logout", logout);
