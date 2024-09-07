import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import AcceptedApplicantTable from './AcceptedApplicantTable';

const AcceptedTable = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAcceptedApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/jobs/${params.id}/accepted-applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.acceptedApplications));
            } catch (error) {
                console.log(error);
            }
        };
        fetchAcceptedApplicants();
    }, [params.id, dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Accepted Applicants ({applicants?.length || 0})</h1>
                <AcceptedApplicantTable showActions={false} />
            </div>
        </div>
    );
};

export default AcceptedTable;
