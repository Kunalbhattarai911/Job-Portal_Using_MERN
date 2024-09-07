import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, Trash2, ChevronDown } from 'lucide-react'; // Added ChevronDown for dropdown
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // For dispatching actions if needed

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    const handleDelete = async (jobId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this job?");
        if (isConfirmed) {
            try {
                await axios.delete(`${JOB_API_END_POINT}/deletejob/${jobId}`);
                dispatch({ type: 'DELETE_JOB', payload: jobId });
                setFilterJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
            } catch (error) {
                console.error("Failed to delete job:", error);
            }
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow key={job._id}>
                            <TableCell>{job?.company?.name}</TableCell>
                            <TableCell>{job?.title}</TableCell>
                            <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className="w-48"> {/* Increased width for dropdown */}
                                        <div onClick={() => navigate(`/admin/jobs/update/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                            <Edit2 className='w-4' />
                                            <span>Edit</span>
                                        </div>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                    <Eye className='w-4' />
                                                    <span>Applicants</span>
                                                    <ChevronDown className='w-4' />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 mt-2">
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants/pending`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                    <span>Pending</span>
                                                </div>
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants/accepted`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                    <span>Accepted</span>
                                                </div>
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants/rejected`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                    <span>Rejected</span>
                                                </div>
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                    <span>Change Status</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        <div onClick={() => handleDelete(job._id)} className='flex items-center gap-2 w-fit cursor-pointer mt-2 text-red-500'>
                                            <Trash2 className='w-4' />
                                            <span>Delete</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
