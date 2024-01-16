import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({ name });

  return res
    .status(201)
    .json(new ApiResponse(200, category, "Category created successfully!"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Category fetched successfully!"));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully!"));
});

const updateCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
      },
    },
    {
      new: true,
    }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, "Category does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCategory: category },
        "Category deleted successfully"
      )
    );
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategory,
};
