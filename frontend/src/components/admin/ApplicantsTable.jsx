import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected", "Pending"];

const statusStyles = {
    Accepted: "bg-green-500",
    Rejected: "bg-red-500",
    Pending: "bg-gray-500 text-white",
};

const rowStyles = {
    noResume: "bg-yellow-100",
};

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    // State for search input
    const [searchTerm, setSearchTerm] = useState('');

    // Ensure applicants is an array, if it's undefined or null, fallback to an empty array
    const applicantList = Array.isArray(applicants?.applications) ? applicants.applications : [];

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filter applicants based on search term (name, email, and contact)
    const filteredApplicants = applicantList.filter((item) => {
        const { fullname, email, phoneNumber } = item?.applicant || {};
        const phone = phoneNumber ? phoneNumber.toString().toLowerCase() : ''; // Convert phoneNumber to string
    
        return (
            (fullname && fullname.toLowerCase().includes(searchTerm)) ||
            (email && email.toLowerCase().includes(searchTerm)) ||
            (phone.includes(searchTerm))
        );
    });

    const statusHandler = async (status, id) => {
        const userConfirmed = window.confirm(`Are you sure you want to update this status to ${status}?`);
        
        if (!userConfirmed) return;

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success('Status updated successfully');
                // Delay before reloading to allow toast message to display
                setTimeout(() => {
                    window.location.reload(); // Reload the page to reflect status changes
                }, 1000); // 1 second delay
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred while updating status');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search by name, email, or contact"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filteredApplicants.length > 0 ? (
                            filteredApplicants.map((item) => {
                                const hasResume = item?.applicant?.profile?.resume;
                                const rowClass = hasResume ? "" : rowStyles.noResume;

                                return (
                                    <TableRow key={item._id} className={rowClass}>
                                        <TableCell>{item?.applicant?.fullname || 'N/A'}</TableCell>
                                        <TableCell>{item?.applicant?.email || 'N/A'}</TableCell>
                                        <TableCell>{item?.applicant?.phoneNumber || 'N/A'}</TableCell>
                                        <TableCell>
                                            {
                                                hasResume ? (
                                                    <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                                        {item?.applicant?.profile?.resumeOriginalName}
                                                    </a>
                                                ) : (
                                                    <span>NA</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {item?.applicant?.createdAt ? item.applicant.createdAt.split("T")[0] : 'N/A'}
                                        </TableCell>
                                        <TableCell>{item.status || 'Pending'}</TableCell>
                                        <TableCell className="float-right">
                                            {
                                                shortlistingStatus.map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => statusHandler(status, item?._id)}
                                                        className={`${statusStyles[status]} text-white px-2 py-1 rounded mx-1`}
                                                        disabled={item.status === status} // Disable button if the status is already set
                                                    >
                                                        {status}
                                                    </button>
                                                ))
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan="7">No applicants found.</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
