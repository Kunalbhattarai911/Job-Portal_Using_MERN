import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SAVEFORLATER_API_END_POINT } from '@/utils/constant';
import Navbar from './shared/Navbar';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const response = await axios.get(`${SAVEFORLATER_API_END_POINT}/saved-jobs`, { withCredentials: true });
                setSavedJobs(response.data);
            } catch (error) {
                setError('Error fetching saved jobs.');
                console.error('Error fetching saved jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, []);

    const handleDelete = async (jobId) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm('Do you want to remove this job from your saved list?');

        if (isConfirmed) {
            try {
                await axios.delete(`${SAVEFORLATER_API_END_POINT}/saved-jobs/${jobId}`, { withCredentials: true });

                // Update the state to remove the deleted job from the list
                setSavedJobs((prevJobs) => prevJobs.filter(job => job._id !== jobId));

                // Show success message
                toast.success('Saved job removed successfully');
            } catch (error) {
                // Show error message
                toast.error('Error removing saved job');
                console.error('Error removing saved job:', error);
            }
        }
    };

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto p-4'>
                <h1 className='text-3xl font-bold text-center mb-6'>Saved Jobs</h1>
                {loading ? (
                    <div className='text-center py-4'>
                        <p className='text-lg font-semibold'>Loading...</p>
                    </div>
                ) : error ? (
                    <div className='text-center py-4'>
                        <p className='text-lg font-semibold text-red-500'>{error}</p>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className='text-center py-4'>
                        <p className='text-lg font-semibold text-gray-500'>No saved jobs found.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {savedJobs.map(savedJob => (
                            <div key={savedJob._id} className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm text-gray-500'>
                                        {daysAgoFunction(savedJob?.job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(savedJob?.job?.createdAt)} days ago`}
                                    </p>
                                </div>

                                <div className='flex items-center gap-2 my-2'>
                                    <Button className="p-6" variant="outline" size="icon">
                                        <Avatar>
                                            <AvatarImage src={savedJob?.job?.company?.logo} />
                                        </Avatar>
                                    </Button>
                                    <div>
                                        <h1 className='font-medium text-lg'>{savedJob?.job?.company?.name}</h1>
                                        <p className='text-sm text-gray-500'>{savedJob?.job?.location || 'Nepal'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h1 className='font-bold text-lg my-2'>{savedJob?.job?.title}</h1>
                                    <p className='text-sm text-gray-600'>{savedJob?.job?.description}</p>
                                </div>

                                <div className='flex items-center gap-2 mt-4'>
                                    <Badge className={'text-blue-700 font-bold'} variant="ghost">{savedJob?.job?.position} Positions</Badge>
                                    <Badge className={'text-[#F83002] font-bold'} variant="ghost">{savedJob?.job?.jobType}</Badge>
                                    <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{savedJob?.job?.salary}</Badge>
                                </div>

                                <div className='flex items-center gap-4 mt-4'>
                                    <Button onClick={() => navigate(`/description/${savedJob?.job?._id}`)} variant="outline">Details</Button>
                                    <Button 
                                        className='bg-red-500 text-white' 
                                        onClick={() => handleDelete(savedJob._id)}>
                                        Remove Saved Job
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
