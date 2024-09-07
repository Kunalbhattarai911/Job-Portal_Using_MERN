import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import RejectedApplicantTable from './RejectedApplicantTable';

const RejectedTable = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchRejectedApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/jobs/${params.id}/rejected-applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.rejectedApplications));
            } catch (error) {
                console.log(error);
            }
        };
        fetchRejectedApplicants();
    }, [params.id, dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Rejected Applicants ({applicants?.length || 0})</h1>
                <RejectedApplicantTable showActions={false} />
            </div>
        </div>
    );
};

export default RejectedTable;
