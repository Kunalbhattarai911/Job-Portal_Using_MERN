import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useSelector } from 'react-redux';

const PendingApplicantTable = () => {
    const { applicants } = useSelector(store => store.application);

    // State for search input
    const [searchTerm, setSearchTerm] = useState('');

    // Ensure applicants is an array, if it's undefined or null, fallback to an empty array
    const applicantList = Array.isArray(applicants) ? applicants : [];

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filter applicants based on search term (name and email)
    const filteredApplicants = applicantList.filter((item) => {
        const { fullname, email, phoneNumber } = item?.applicant || {};
        const phone = phoneNumber ? phoneNumber.toString().toLowerCase() : ''; // Convert phoneNumber to string
    
        return (
            (fullname && fullname.toLowerCase().includes(searchTerm)) ||
            (email && email.toLowerCase().includes(searchTerm)) ||
            (phone.includes(searchTerm))
        );
    });
    

    return (
        <div>
            <input
                type="text"
                placeholder="Search by name or email or number"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            <Table>
                <TableCaption>A list of pending applicants</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filteredApplicants.length > 0 ? (
                            filteredApplicants.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item?.applicant?.fullname || 'N/A'}</TableCell>
                                    <TableCell>{item?.applicant?.email || 'N/A'}</TableCell>
                                    <TableCell>{item?.applicant?.phoneNumber || 'N/A'}</TableCell>
                                    <TableCell>
                                        {
                                            item?.applicant?.profile?.resume ? (
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
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="5">No pending applicants found.</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default PendingApplicantTable;
