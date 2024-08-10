import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategoryById,
} from "../controllers/category.controller.js";

const router = Router();

router.route("/").get(getAllCategories).post(createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .patch(updateCategoryById)
  .delete(deleteCategory);

export default router;
