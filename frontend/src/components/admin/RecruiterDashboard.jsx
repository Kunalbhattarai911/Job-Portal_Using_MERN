import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar'; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { setStatistics } from '@/redux/statisticsSlice'; 

const Dashboard = () => {
    const dispatch = useDispatch();
    const statistics = useSelector(store => store.statistics); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/statistics`, { withCredentials: true });
                dispatch(setStatistics(res.data)); 
            } catch (error) {
                console.error("Error fetching statistics:", error);
                setError("Failed to load statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dispatch]);

    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className=' min-h-screen'>
            <Navbar />
            <div className='max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-6'>
                <h1 className='text-4xl font-extrabold mb-6 text-center text-gray-800'>Dashboard</h1>
                
                <div className='mb-8 p-8 bg-gray-50 rounded-lg shadow-xl text-center'>
                    <p className='text-2xl font-semibold text-gray-800'>
                        Welcome to <span className='text-[#F83002]'>Rojgar Sewa</span>!
                    </p>
                    <p className='mt-4 text-lg text-gray-700'>
                        We are delighted to welcome you to <span className='text-[#F83002]'>Rojgar Sewa</span>, the premier platform for streamlined recruitment management. Leverage our tools to effortlessly create job postings, manage company profiles, and track applicant statuses with ease. Dive into our features to enhance your recruitment strategy and drive success.
                    </p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
                    <Link to="/admin/companies" className='bg-blue-50 p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-blue-100'>
                        <h3 className='text-xl font-semibold mb-3 text-blue-700'>Total Companies</h3>
                        <p className='text-4xl font-bold text-blue-900'>{statistics?.companyCount || 0}</p>
                    </Link>
                    <Link to="/admin/jobs" className='bg-green-50 p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-green-100'>
                        <h3 className='text-xl font-semibold mb-3 text-green-700'>Total Jobs</h3>
                        <p className='text-4xl font-bold text-green-900'>{statistics?.jobCount || 0}</p>
                    </Link>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
                    <div className='bg-yellow-50 p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-yellow-100'>
                        <h3 className='text-xl font-semibold mb-3 text-yellow-700'>Total Applicants</h3>
                        <p className='text-4xl font-bold text-yellow-900'>{statistics?.applicantCount || 0}</p>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-8'>
                    <div className='bg-orange-50 p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-orange-100'>
                        <h3 className='text-xl font-semibold mb-3 text-orange-700'>Pending Applications</h3>
                        <p className='text-4xl font-bold text-orange-900'>{statistics?.pendingCount || 0}</p>
                    </div>
                    <div className='bg-teal-50 p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-teal-100'>
                        <h3 className='text-xl font-semibold mb-3 text-teal-700'>Accepted Applications</h3>
                        <p className='text-4xl font-bold text-teal-900'>{statistics?.acceptedCount || 0}</p>
                    </div>
                    <div className='bg-red-50 p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-red-100'>
                        <h3 className='text-xl font-semibold mb-3 text-red-700'>Rejected Applications</h3>
                        <p className='text-4xl font-bold text-red-900'>{statistics?.rejectedCount || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
