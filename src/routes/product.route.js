import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
    ]),
    createProduct
  );

router.route("/category/:id").get(getProductsByCategory);

router
  .route("/:id")
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
