import { Router } from "express";
import {
  read,
  find,
  findById,
  create,
  update,
  remove,
  checkIn,
  checkOut,
} from "../controllers/HotelController";

const routes = Router();

routes.get("/", read);
routes.get("/find", find);
routes.get("/:id", findById);
routes.post("/", create);
routes.put("/:id", update);
routes.put("/check-in/:id", checkIn);
routes.put("/check-out/:id", checkOut);
routes.delete("/:id", remove);

export default routes;
