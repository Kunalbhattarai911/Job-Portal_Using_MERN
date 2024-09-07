import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if the company name already exists
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company name already exists.",
                success: false
            });
        }

        // Create the new company
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while registering the company.",
            error: error.message,
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retriving the data",
            error: error.message,
            success: false
        });
    }
};

// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retriving the data",
            error: error.message,
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        // Check if the new company name already exists
        if (name) {
            const existingCompany = await Company.findOne({ name });
            if (existingCompany && existingCompany._id.toString() !== req.params.id) {
                return res.status(400).json({
                    message: "Company name already exists.",
                    success: false
                });
            }
        }

        // Handle file upload if provided
        let logo = null;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        // Prepare data for update
        const updateData = { name, description, website, location };
        if (logo) {
            updateData.logo = logo;
        }

        // Update the company
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            company,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the company.",
            error: error.message,
            success: false
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Find the company
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Find and delete all jobs related to the company
        const jobs = await Job.find({ company: companyId });
        const jobIds = jobs.map(job => job._id);

        // Delete all applications related to the jobs
        await Application.deleteMany({ job: { $in: jobIds } });

        // Delete all jobs
        await Job.deleteMany({ company: companyId });

        // Finally, delete the company
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company, associated jobs, and job applications deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log('Error deleting company:', error);
        return res.status(500).json({
            message: "An error occurred while deleting the company.",
            success: false
        });
    }
};
