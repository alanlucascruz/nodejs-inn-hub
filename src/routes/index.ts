import { Router } from "express";
import auth from "../middlewares/AuthMiddleware";
import authRoutes from "./AuthRoutes";
import hotelRoutes from "./HotelRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/hotel", auth, hotelRoutes);

export default routes;
