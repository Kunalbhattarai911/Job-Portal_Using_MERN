import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

// admin le job post garxa
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary,
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while adding the data",
            error: error.message,
            success: false
        });
    }
};
// Seeker ko lagi
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
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
// Seeker 
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Job ID.",
                success: false
            });
        }

        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retrieving the data",
            error: error.message,
            success: false
        });
    }
};

// admin le kati job create garya xa tesko data dekhauna ko lagi
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
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

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Find the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Delete all applications related to the job
        await Application.deleteMany({ job: jobId });

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job and associated applications deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log('Error deleting job:', error);
        return res.status(500).json({
            message: "An error occurred while deleting the job.",
            success: false
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log('Job ID:', jobId); 
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Job ID.",
                success: false
            });
        }

        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel,
            position,
            company
        } = req.body;

        // Prepare update data
        let updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (requirements) updateData.requirements = requirements.split(",");
        if (salary) updateData.salary = salary;
        if (location) updateData.location = location;
        if (jobType) updateData.jobType = jobType;
        if (experienceLevel) updateData.experienceLevel = experienceLevel;
        if (position) updateData.position = position;
        if (company) updateData.company = company;

        // Update job
        const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log('Error:', error); // Debugging line
        return res.status(500).json({
            message: "An error occurred while updating the job.",
            error: error.message,
            success: false
        });
    }
};
