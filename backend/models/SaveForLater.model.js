import mongoose from 'mongoose';

const saveForLaterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
}, { timestamps: true });


export const SaveForLater = mongoose.model('SaveForLater', saveForLaterSchema);
