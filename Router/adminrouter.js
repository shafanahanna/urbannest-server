import express from "express";
import {
  BlockUser,
  addProperty,
  adminlogin,
  deleteProperty,
  getAllOrders,
  propertybyid,
  updateproperties,
  viewUser,
  viewUserById,
  
  viewallproperty,
} from "../Controllers/admin_controller.js";
import { verifyToken } from "../Middleware/adminauth.js";
import imageupload from "../Middleware/imageupload/imageupload.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../Controllers/categorycontroller.js";

const router = express.Router();

router.post("/login", adminlogin);
router.use(verifyToken);
router.get("/users", viewUser);
router.get("/users/:id", viewUserById);
router.post("/properties", imageupload, addProperty);
router.get("/properties", viewallproperty);
router.get("/properties/:id", propertybyid);
router.put("/properties/:_id", updateproperties);
router.delete("/properties/:_id", deleteProperty);
router.patch("/users/:id", BlockUser);
router.get("/orders",getAllOrders)
router.post("/categories",createCategory)
router.get("/categories",getCategories)
router.put("/categories/:id",updateCategory)
router.delete("/categories/:id",deleteCategory)

export default router;
