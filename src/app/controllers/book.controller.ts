import express, { Request, Response } from "express";
import { Books } from "../models/book.model";

export const bookRoutes = express.Router();

// Error handler
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

  res.status(500).json({
    message: "Something went wrong",
    success: false,
    error: {
      name: error.name,
      message: error.message,
    },
  });
};

// 1. Create Book
bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Books.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

// 2. Get All Books
bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const query = req.query.genre;
    let books;
    if (query) {
      books = await Books.find({ genre: query }).sort({ title: 1 }).limit(10);
    } else {
      books = await Books.find().sort({ title: 1 }).limit(10);
    }

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

// 3. Get Book by ID

bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Books.findById(bookId);

    if (!book) {
      throw new Error("Book not found");
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

// 4. Update Book

bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const body = req.body;
    const book = await Books.findByIdAndUpdate(bookId, body, { new: true });

    if (!book) {
      throw new Error("Book not found");
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

// 5. Delete Book

bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Books.findByIdAndDelete(bookId);
    if (!book) {
      throw new Error("Book not found");
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});
