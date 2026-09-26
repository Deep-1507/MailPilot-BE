import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    APIKEY: {
        type: String,
        required: true,
        trim: true,
        Length: 50,
    },
    creationDate: {
        type: String,
        required: true,
        trim: true,
        Length: 50,
    },
}, {
    collection: 'APIKeys',
    timestamps:true
});

const API = mongoose.model('API', apiSchema);

export default API;