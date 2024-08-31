import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { Button } from './ui/button';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    const deleteApplicationHandler = async (applicationId) => {
        try {
            // Show confirmation dialog
            const isConfirmed = window.confirm("Do you want to delete this application?");
            if (!isConfirmed) return;

            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/deleteapplication/${applicationId}`);
            if (res.data.success) {
                toast.success(res.data.message);
                // Reload the page after successful deletion
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while deleting the application.");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                                        {appliedJob.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" onClick={() => deleteApplicationHandler(appliedJob._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobTable;
