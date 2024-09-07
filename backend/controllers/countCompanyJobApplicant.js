import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

export const getUserStatistics = async (req, res) => {
    try {
        const userId = req.id; 

        // Count total companies associated with the user
        const companyCount = await Company.countDocuments({ userId });

        // Get all the company IDs related to the user
        const userCompanies = await Company.find({ userId }, '_id');
        const companyIds = userCompanies.map(company => company._id);

        // Count total jobs associated with the user's companies
        const jobCount = await Job.countDocuments({ company: { $in: companyIds } });

        // Get all the job IDs related to the user's companies
        const jobIds = await Job.find({ company: { $in: companyIds } }, '_id');
        const jobIdsArray = jobIds.map(job => job._id);

        // Count total applicants (applications) for the user's jobs
        const applicantCount = await Application.countDocuments({ job: { $in: jobIdsArray } });

        // Count applicants by status
        const pendingCount = await Application.countDocuments({ job: { $in: jobIdsArray }, status: 'pending' });
        const acceptedCount = await Application.countDocuments({ job: { $in: jobIdsArray }, status: 'accepted' });
        const rejectedCount = await Application.countDocuments({ job: { $in: jobIdsArray }, status: 'rejected' });

        return res.status(200).json({
            companyCount,
            jobCount,
            applicantCount,
            pendingCount,
            acceptedCount,
            rejectedCount,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching user statistics.",
            error: error.message,
            success: false
        });
    }
};
