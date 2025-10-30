import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: Number = 3001;

app.use(express.json());

interface IUser {
    nome: string,
    sobrenome: string,
}

app.get('/user', (req: Request<{}, {}, {}, IUser>, res: Response) => {
    const user: IUser = req.query;

    res.status(200).json(user);
})

app.listen(port, () => {
    console.log(`Servidor iniciado: http://localhost:${port}`);
});