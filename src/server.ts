import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes";

const app: Express = express();
const port: Number = 3001;

const connectDatabase = async () => {
  const user: string = <string>process.env.DB_USER;
  const password: string = <string>process.env.DB_PASSWORD;
  const uri: string = `mongodb+srv://${user}:${password}@cluster0.isbttru.mongodb.net/?appName=Cluster0`;

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
};

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

(async () => {
  await connectDatabase();
  applyMiddlewares();
  startServer();
})();
