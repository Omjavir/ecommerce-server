import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(getAllProducts).post(createProduct);

router
  .route("/:id")
  .get(getProductById)
  .get(getProductsByCategory)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
