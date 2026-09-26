import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const businessUserSchema = new mongoose.Schema({
    createdByUserId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    }
}, {
    collection: 'businessusers', // Specify the collection name here
    timestamps:true
});


const BusinessUser = mongoose.model('BusinessUser', businessUserSchema);

export default BusinessUser;