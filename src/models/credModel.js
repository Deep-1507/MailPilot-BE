import mongoose from "mongoose";

const credSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    companyName: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    senderEmail: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique:true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    }
}, {
    collection: 'creds',
    timestamps:true
});

const Cred = mongoose.model('Cred', credSchema);

export default Cred;