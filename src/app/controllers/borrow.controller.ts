import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { Books } from "../models/book.model";

export const borrowRoutes = express.Router();

//  Error handler
const handleError = (error: any, res: Response) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }

  res.status(400).json({
    message: "Validation failed",
    success: false,
    error: {
      name: error.name,
      message: error.message,
    },
  });
};

// 6. Borrow a Books

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Books.findById(body.book);
    if (!book) {
      throw new Error("Book not found");
    }

    if (book.copies < body.quantity) {
      throw new Error("Not enough copies available");
    }

    if (body.quantity <= 0) {
      throw new Error("Quantity must be a positive number");
    }

    let borrow;
    if (book.copies > 0) {
      await Books.findOneAndUpdate(
        book._id,
        {
          copies: book.copies - body.quantity,
          available: book.copies - body.quantity > 0 ? true : false,
        },
        { new: true }
      );
      borrow = await Borrow.create(body);

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow,
      });
    } else {
      throw new Error("Book is not available");
    }
  } catch (error: any) {
    handleError(error, res);
  }
});

// 7. Borrowed Books Summary (Using Aggregation)

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$book.title",
            isbn: "$book.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: borrows,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});
