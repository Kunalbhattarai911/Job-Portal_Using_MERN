import { SaveForLater } from '../models/SaveForLater.model.js';
import { Job } from '../models/job.model.js';

// save for later click garda create hune tarika

export const saveJobForLater = async (req, res) => {
    try {
        const { jobId } = req.body; 
        const userId = req.id;  

        if (!jobId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID and User ID are required'
            });
        }

        const savedJob = await SaveForLater.create({ user: userId, job: jobId });

        return res.status(200).json({
            success: true,
            message: 'Job saved for later',
            data: savedJob
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error saving job for later',
            error: error.message
        });
    }
};

// saved jobs lai get garne tarika
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const savedJobs = await SaveForLater.find({ user: userId })
        .populate({
            path: 'job',
            populate: {
                path: 'company'
            }
        });
        res.status(200).json(savedJobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved jobs', error });
    }
};

//saved job lai remove garne controller
export const removeSavedJob = async (req, res) => {
    try {
        const { id } = req.params;  
        const userId = req.id; 

        if (!id || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Saved job ID and User ID are required'
            });
        }

        // Find and remove the saved job
        const removedJob = await SaveForLater.findOneAndDelete({ _id: id, user: userId });

        if (!removedJob) {
            return res.status(404).json({
                success: false,
                message: 'Saved job not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Saved job removed successfully',
            data: removedJob
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error removing saved job',
            error: error.message
        });
    }
};
