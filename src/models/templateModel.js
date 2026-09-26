import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
     userID: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    comments: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    template: {
        type: String,
        trim: true,
        minLength: 1,
    },
}, {
    collection: 'templates',
    timestamps:true
});

const Template = mongoose.model('Template', templateSchema);

export default Template;