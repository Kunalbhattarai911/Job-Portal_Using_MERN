import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useNavigate } from 'react-router-dom'

const filterData = [
    {
        filterType: "Location",
        array: [
            "Kathmandu",
            "Bhaktapur",
            "Biratnagar",
            "Pokhara",
            "Dang",
            "Dharan",
            "Damak",
            "Birgunj",
            "Janakpur",
            "Hetauda",
            "Itahari",
            "Lalitpur"
          ]
    },
    {
        filterType: "Industry",
        array: [
            "Frontend Developer",
            "Backend Developer",
            "FullStack Developer",
            "Teacher",
            "Nurse",
            "Waiter",
            "Chef",
            "Graphic Designer",
            "Software Engineer",
            "Product Manager",
            "HR Manager",
            "Accountant"
          ]
          
    },
    {
        filterType: "Salary",
        array: [
            "0-50k",
            "50k-99k",
            "1lac-5lac"
          ] // Adjust to numerical ranges as strings
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate(); // React Router's navigate function

    const changeHandler = (value) => {
        setSelectedValue(value);
    };

    useEffect(() => {
        if (selectedValue) {
            navigate(`?filter=${selectedValue}`); // Update the URL with selected filter
        }
    }, [selectedValue, navigate]);

    return (
        <div className='w-full bg-white p-3 rounded-md '>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    filterData.map((data, index) => (
                        <div key={index}>
                            <h1 className='font-bold text-lg'>{data.filterType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div className='flex items-center space-x-2 my-2' key={itemId}>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label htmlFor={itemId}>{item}</Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard;
