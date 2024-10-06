import { Router } from "express"
import getCompletion from "../controllers/meaning.js";

const appRouter = Router()


appRouter.post('/chat', getCompletion);

appRouter.get('/', (req, res) => {
    res.send('Hello, World!');
});



export default appRouter