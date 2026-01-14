import express from "express";
import { createEvent, getEvents, getEventById } from "../controllers/event.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// ADMIN ROUTES
// Only admins can create events
router.post("/", authMiddleware, adminMiddleware, createEvent);

// USER ROUTES
// Get all events
router.get("/", getEvents);

// Get single event by ID
router.get("/:id", getEventById);

export default router;
