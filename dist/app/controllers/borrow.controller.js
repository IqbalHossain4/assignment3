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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const book_model_1 = require("../models/book.model");
exports.borrowRoutes = express_1.default.Router();
//  Error handler
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
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const book = yield book_model_1.Books.findById(body.book);
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
            yield book_model_1.Books.findOneAndUpdate(book._id, {
                copies: book.copies - body.quantity,
                available: book.copies - body.quantity > 0 ? true : false,
            }, { new: true });
            borrow = yield borrow_model_1.Borrow.create(body);
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrow,
            });
        }
        else {
            throw new Error("Book is not available");
        }
    }
    catch (error) {
        handleError(error, res);
    }
}));
// 7. Borrowed Books Summary (Using Aggregation)
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrows = yield borrow_model_1.Borrow.aggregate([
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
    }
    catch (error) {
        handleError(error, res);
    }
}));
