import { Router } from "express";
import { signIn, signUp } from "../controllers/AuthController";

const routes = Router();

routes.post("/signin", signIn);

routes.post("/signup", signUp);

export default routes;
