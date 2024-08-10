import mongoose, { Schema } from "mongoose";
import { Category } from "./category.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new Schema(
  {
    category: {
      ref: "Category",
      required: true,
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    image: {
      required: true,
      type: {
        url: String,
        localPath: String,
      },
    },
    name: {
      required: true,
      type: String,
    },
    price: {
      default: 0,
      type: Number,
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
