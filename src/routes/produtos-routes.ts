import { Router, type IRouter } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ProdutosController } from '../controllers/ProdutosController';

const router: IRouter = Router();

router.get("/", ProdutosController.listar);
router.post("/popular", ProdutosController.popularProdutos);
router.get("/:id", ProdutosController.detalharProduto);
router.post("/:id/validar-estoque", authMiddleware, ProdutosController.validarEstoque);

export default router;