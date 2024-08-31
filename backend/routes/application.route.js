import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, deleteApplication, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/deleteapplication/:id").delete(isAuthenticated, deleteApplication);
 

export default router;

