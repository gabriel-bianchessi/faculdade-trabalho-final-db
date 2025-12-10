import { Router, type IRouter } from "express";
import { ClientesController } from "../controllers/ClientesController";

const router: IRouter = Router();

router.post("/registrar", ClientesController.registrar);
router.post("/login", ClientesController.login);
router.get("/email/:email", ClientesController.buscarPorEmail);

export default router;
