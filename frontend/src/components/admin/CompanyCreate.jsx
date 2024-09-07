import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setCompanyName(e.target.value);
    }

    const registerNewCompany = async () => {
        if (companyName.trim() === '') {
            toast.error('Company name cannot be empty.');
            return;
        }

        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            } else if (res?.data?.message) {
                if (res.data.message.includes("already exists")) {
                    toast.error("Company name is already registered.");
                } else {
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            if (error.response) {
                // Server responded with a status other than 2xx
                toast.error(`Error: ${error.response.data.message || 'An error occurred while registering the company.'}`);
            } else if (error.request) {
                // Request was made but no response received
                toast.error('No response from server.');
            } else {
                // Something else happened while setting up the request
                toast.error('An unexpected error occurred.');
            }
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? You can change this later.</p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="Please Enter Your Company Name Here !!!"
                    value={companyName}
                    onChange={handleChange}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany}>Continue</Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate
