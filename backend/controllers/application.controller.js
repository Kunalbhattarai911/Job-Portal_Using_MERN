import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while applying the job",
            error: error.message,
            success: false
        });
    }
};


export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
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


// admin le herxa kati user le apply garya xan 
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    }catch (error) {
        return res.status(500).json({
            message: "An error occurred while retriving the data",
            error: error.message,
            success: false
        });
    }
};


export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the data",
            error: error.message,
            success: false
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const userId = req.id;
        const applicationId = req.params.id;

        // Find the application by ID and ensure it belongs to the user
        const application = await Application.findOne({ _id: applicationId, applicant: userId });

        if (!application) {
            return res.status(404).json({
                message: "Application not found or you are not authorized to delete it.",
                success: false
            });
        }

        // Find the related job and remove the application reference
        const job = await Job.findById(application.job);
        if (job) {
            job.applications.pull(application._id);
            await job.save();
        }

        // Delete the application
        await Application.deleteOne({ _id: applicationId });

        return res.status(200).json({
            message: "Application deleted successfully.",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the application.",
            error: error.message,
            success: false
        });
    }
};