import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { BookmarkIcon } from 'lucide-react'; 
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { SAVEFORLATER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const Job = ({ job }) => {
    const [isFavourite, setIsFavourite] = useState(false); 
    const navigate = useNavigate();

    // Fetch if the job is already saved 
    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const response = await axios.get(`${SAVEFORLATER_API_END_POINT}/saved-jobs`, { withCredentials: true });
                const isJobSaved = response.data.some(savedJob => savedJob.job._id === job._id);
                setIsFavourite(isJobSaved);
            } catch (error) {
                console.error('Error checking if job is saved:', error);
            }
        };

        checkIfSaved();
    }, [job._id]);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const handleFavouriteClick = async () => {
        const isConfirmed = window.confirm('Do you want to store this job for later?');
    
        if (isConfirmed) {
            try {
                const response = await axios.post(
                    `${SAVEFORLATER_API_END_POINT}/save-for-later`,
                    { jobId: job._id },
                    { withCredentials: true }
                );
    
                if (response.data.success) {
                    setIsFavourite(true);
                    toast.success('Job saved for later successfully');
                }
            } catch (error) {
                console.error('Error saving job for later:', error);
    
                if (error.response && error.response.status === 401) {
                    toast.error('You need to be logged in to save a job');
                } else {
                    toast.error('Error saving job for later');
                }
            }
        }
    };
    

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button
                    variant="outline"
                    className={`rounded-full p-1 ${isFavourite ? 'text-blue-500' : 'text-gray-500'}`} // Conditional styling for bookmark
                    size="icon"
                    disabled={isFavourite} 
                    onClick={handleFavouriteClick}
                >
                    <BookmarkIcon className={`w-5 h-5 ${isFavourite ? 'text-blue-500' : 'text-gray-500'}`} />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>Nepal</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button 
                    className={`bg-[#7209b7] ${isFavourite ? 'bg-gray-500' : ''}`} 
                    onClick={handleFavouriteClick}
                    disabled={isFavourite}
                >
                    {isFavourite ? 'Job-Saved' : 'Save For Later'}
                </Button>
            </div>
        </div>
    );
};

export default Job;
