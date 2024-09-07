import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    companyCount: 0,
    jobCount: 0,
    applicantCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
};

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        setStatistics: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setStatistics } = statisticsSlice.actions;

export default statisticsSlice.reducer;
