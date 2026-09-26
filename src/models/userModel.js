import mongoose from 'mongoose';
import bcrypt from "bcrypt";

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    apiKeyId: {
        type: String,
        trim: true,
    },
}, {
    collection: 'users', // Specify the collection name here
    timestamps:true
});


const User = mongoose.model('User', userSchema);

export default User;