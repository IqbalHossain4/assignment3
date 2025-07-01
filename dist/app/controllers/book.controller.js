"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.bookRoutes = express_1.default.Router();
// Error handler
const handleError = (error, res) => {
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
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (yield book_model_1.Books.exists({ isbn: body.isbn })) {
            throw new Error("Book already exists");
        }
        const book = yield book_model_1.Books.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        handleError(error, res);
    }
}));
// 2. Get All Books
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.genre;
        let books;
        if (query) {
            books = yield book_model_1.Books.find({ genre: query }).sort({ title: 1 }).limit(10);
        }
        else {
            books = yield book_model_1.Books.find().sort({ title: 1 }).limit(10);
        }
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        handleError(error, res);
    }
}));
// 3. Get Book by ID
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Books.findById(bookId);
        if (!book) {
            throw new Error("Book not found");
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        handleError(error, res);
    }
}));
// 4. Update Book
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const body = req.body;
        const book = yield book_model_1.Books.findByIdAndUpdate(bookId, body, { new: true });
        if (!book) {
            throw new Error("Book not found");
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        handleError(error, res);
    }
}));
// 5. Delete Book
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Books.findByIdAndDelete(bookId);
        if (!book) {
            throw new Error("Book not found");
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        handleError(error, res);
    }
}));
