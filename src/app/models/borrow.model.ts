import { model, Schema } from "mongoose";
import { IBorrow } from "../interface/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
