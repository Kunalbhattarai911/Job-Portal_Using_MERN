import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, deleteApplication, getAcceptedApplicants, getApplicants, getApplicantsCount, getAppliedJobs, getPendingApplicants, getRejectedApplicants, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/deleteapplication/:id").delete(isAuthenticated, deleteApplication);
router.route("/jobs/:id/pending-applicants").get(isAuthenticated, getPendingApplicants);
router.route("/jobs/:id/accepted-applicants").get(isAuthenticated, getAcceptedApplicants);
router.route("/jobs/:id/rejected-applicants").get(isAuthenticated, getRejectedApplicants);
router.route("/jobs/:id/applicants/count").get(isAuthenticated, getApplicantsCount);
 

export default router;

