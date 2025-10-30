import express, { Express } from "express";
import cors from "cors";
import routes from "./routes";

const app: Express = express();
const port: Number = 3001;

const applyMiddlewares = () => {
  app.use(cors());
  app.use(express.json());
  app.use("/", routes);
};

const startServer = () => {
  app.listen(port, () => {
    console.log(`Servidor iniciado: http://localhost:${port}`);
  });
};

(() => {
  applyMiddlewares();
  startServer();
})();
