import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteCompany, getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
import { getUserStatistics } from "../controllers/countCompanyJobApplicant.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);
router.route("/deletecompany/:id").delete( deleteCompany);
router.route("/statistics").get(isAuthenticated, getUserStatistics);

export default router;

