import { Router } from "express";
import authRoutes from "./AuthRoutes";

const routes = Router();

routes.use("/auth", authRoutes);

export default routes;
