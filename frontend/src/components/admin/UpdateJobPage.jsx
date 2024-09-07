import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';

const jobTypes = [
    'Full-Time',
    'Part-Time',
    'Contract',
    'Freelance',
    'Internship',
    'Temporary',
    'Remote',
    'Hybrid',
    'Seasonal',
    'Volunteer'
];

const UpdateJob = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        experienceLevel: "",
        location: "",
        jobType: "",
        position: "",
        company: ""
    });
    const { singleJob } = useSelector(store => store.job);
    const { companies } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobById = async () => {
            const id = window.location.pathname.split("/")[4];
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
                    withCredentials: true
                });

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                toast.error('Failed to fetch job details.');
            }
        };
        fetchJobById();
    }, [dispatch]);

    useEffect(() => {
        setInput({
            title: singleJob.title || "",
            description: singleJob.description || "",
            requirements: singleJob.requirements?.join(",") || "",
            salary: singleJob.salary || "",
            experienceLevel: singleJob.experienceLevel || "",
            location: singleJob.location || "",
            jobType: singleJob.jobType || "",
            position: singleJob.position || "",
            company: singleJob.company || ""
        });
    }, [singleJob]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, company: value });
    };

    const jobTypeChangeHandler = (value) => {
        setInput({ ...input, jobType: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
    
        // Validation
        const requiredFields = ['title', 'description', 'requirements', 'salary', 'experienceLevel', 'location', 'jobType', 'position', 'company'];
        for (const field of requiredFields) {
            const value = input[field];
            if (!value || String(value).trim() === '') {
                toast.error(`${field.replace(/([A-Z])/g, ' $1')} is required.`);
                return;
            }
        }
    
        const updateData = { ...input };
    
        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/updatejob/${params.id}`, updateData, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || 'An error occurred while updating the job.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            {console.log(input)}
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick={() => navigate("/admin/jobs")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Update Job</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Select value={input.jobType} onValueChange={jobTypeChangeHandler}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {jobTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience Year</Label>
                            <Input
                                type="number"
                                name="experienceLevel"
                                value={input.experienceLevel}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>No Of Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Company</Label>
                            {
                                companies.length > 0 ? (
                                    <Select value={input.company} onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => (
                                                        <SelectItem key={company._id} value={company._id}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        type="text"
                                        name="company"
                                        value={input.company}
                                        onChange={changeEventHandler}
                                    />
                                )
                            }
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
                </form>
            </div>
        </div>
    );
}

export default UpdateJob;
