import { asyncHandler } from "../utils/AsyncHandler.js";
import { Product } from "../models/product.model.js";
import {
  getLocalPath,
  getMongoosePaginationOptions,
  getStaticFilePath,
} from "../utils/helpers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const productAggregate = Product.aggregate([
    {
      $match: {},
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
  const { name, description, category, image, price } = req.body;

  const categoryToBeAdded = await Category.findById(category);

  if (!categoryToBeAdded) {
    throw new ApiError(404, "Category does not exist");
  }

  if (!image) {
    throw new ApiError(400, "Provide product image");
  }

  const imageUrl = getStaticFilePath(req, req.files?.image[0]?.filename);
  const imageLocalPath = getLocalPath(req.files?.mainImage[0]?.filename);

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image: {
      url: imageUrl,
      localPath: imageLocalPath,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export { getAllProducts, createProduct };
