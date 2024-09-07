import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import PendingApplicantTable from './PendingApplicantTable';

const PendingTable = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchPendingApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/jobs/${params.id}/pending-applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.pendingApplications));
            } catch (error) {
                console.log(error);
            }
        };
        fetchPendingApplicants();
    }, [params.id, dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Pending Applicants ({applicants?.length || 0})</h1>
                <PendingApplicantTable showActions={false} />
            </div>
        </div>
    );
};

export default PendingTable;
