import { type IRouter, Router } from "express";
import { CategoriasController } from "../controllers/CategoriasController";

const router: IRouter = Router();

router.get("/", CategoriasController.listar);
export default router;
