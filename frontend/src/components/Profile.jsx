import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector, useDispatch } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { USER_API_END_POINT } from '@/utils/constant';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/logoutSlice'; // Import the logout action

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");

        if (confirmDelete) {
            try {
                const response = await fetch(`${USER_API_END_POINT}/user/${user._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    // Clear cookies, local storage, and any other session data
                    document.cookie = 'token="token"; Max-Age=0; path=/;'; // Replace 'token' with the name of your cookie
                    localStorage.clear(); // Clear all localStorage items, or you can remove specific items

                    alert("User deleted successfully.");

                    // Dispatch logout action if you're using Redux
                    dispatch(logout());

                    navigate('/'); // Redirect to the home page or login page

                    // Reload the page after a successful deletion
                    window.location.reload();
                } else {
                    alert(data.message || "Failed to delete user.");
                }
            } catch (error) {
                alert("An error occurred. Please try again.");
            }
        }
    }

    const calculateAge = (birthYear) => {
        if (!birthYear) {
            return 'NA';
        }

        const birthDate = new Date(birthYear);
        if (isNaN(birthDate.getTime())) {
            return 'NA';
        }

        const currentYear = new Date().getFullYear();
        return currentYear - birthDate.getFullYear();
    }

    const age = user?.birth_year ? calculateAge(user.birth_year) : 'NA';

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                        <Button onClick={handleDelete} className="text-right" variant="destructive"><Trash2 /></Button>
                    </div>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <p><b>Age:</b>{age}</p>
                </div>
                <div className='my-5'>
                    <h1><b>Skills</b></h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile;
