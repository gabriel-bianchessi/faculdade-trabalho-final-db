import { Router, type IRouter } from "express";
import { PedidosController } from "../controllers/PedidosController";

const router: IRouter = Router();

router.post("/", PedidosController.criar);
router.get("/", PedidosController.listar);
router.get("/cliente/:id_cliente", PedidosController.listarPorCliente);

export default router;
