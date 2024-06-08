import express from "express";
import { google } from "../Controllers/authController.js";

const router = express.Router();

router.post("/google", google);

export default router;
