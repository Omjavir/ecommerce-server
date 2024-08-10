import { asyncHandler } from "../utils/AsyncHandler.js";
import { Product } from "../models/product.model.js";
import {
  getLocalPath,
  getMongoosePaginationOptions,
  getStaticFilePath,
  removeLocalFile,
} from "../utils/helpers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25 } = req.query;
  const productAggregate = Product.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
  ]);

  const products = await Product.aggregatePaginate(
    productAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalProducts",
        docs: "products",
      },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully!"));
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price } = req.body;

  const categoryToBeAdded = await Category.findById(category);

  if (!categoryToBeAdded) {
    throw new ApiError(404, "Category does not exist");
  }

  if (!req.files?.image || !req.files?.image.length) {
    throw new ApiError(400, "Provide product image");
  }

  const productImageLocalPath = req.files?.image[0]?.path;

  const productImage = await uploadOnCloudinary(productImageLocalPath);

  if (!productImage) {
    throw new ApiError(400, "Provide a product image");
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image: productImage,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const image = req.files?.image?.length
    ? {
        // If user has uploaded new image then we have to create an object with new url and local path in the project
        url: getStaticFilePath(req, req.files?.image[0]?.filename),
        localPath: getLocalPath(req.files?.image[0]?.filename),
      }
    : product.image; // if there is no new main image uploaded we will stay with the old main image of the product

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        description,
        category,
        price,
        image,
      },
    },
    {
      new: true,
    }
  );

  // Once the product is updated. Do some cleanup
  if (product.image.url !== image.url) {
    // If user is uploading new main image remove the previous one because we don't need that anymore
    removeLocalFile(product.image.localPath);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const category = await Category.findById(id).select("name _id");

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const productAggregate = await Product.aggregate([
    {
      $match: {
        category: new mongoose.Types.ObjectId(id),
      },
    },
  ]);

  // const products = await Product.aggregatePaginate(
  //   productAggregate,
  //   getMongoosePaginationOptions({
  //     page,
  //     limit,
  //     customLabels: {
  //       totalDocs: "totalProducts",
  //       docs: "products",
  //     },
  //   })
  // );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products: productAggregate },
        "Product's fetched successfully!"
      )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOneAndDelete({
    _id: id,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const productImage = [product.image];

  productImage.map((image) => {
    // Removing the image related to product that is being deleted
    removeLocalFile(image.localPath);
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedProduct: product },
        "Product deleted successfully!"
      )
    );
});

export {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  getProductsByCategory,
  deleteProduct,
};
