import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Helper function to convert salary strings like "20k", "1lakh" to numbers
const convertSalaryStringToNumber = (salary) => {
    if (salary.toLowerCase().includes('k')) {
        return parseInt(salary.replace('k', '')) * 1000;
    } else if (salary.toLowerCase().includes('lac')) {
        return parseInt(salary.replace('lac', '')) * 100000;
    } else {
        return parseInt(salary);
    }
};

const Jobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const location = useLocation(); // Get the current URL

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchedQuery = queryParams.get('filter');

        if (searchedQuery) {
            const [minSalary, maxSalary] = searchedQuery.includes('-')
                ? searchedQuery.split('-').map(convertSalaryStringToNumber)
                : [null, null];

            const filteredJobs = allJobs.filter((job) => {
                const jobSalary = convertSalaryStringToNumber(job.salary);

                if (minSalary !== null && maxSalary !== null) {
                    return jobSalary >= minSalary && jobSalary <= maxSalary;
                }

                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase());
            });

            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, location.search]); 

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs;
