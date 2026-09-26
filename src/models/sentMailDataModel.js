import mongoose from "mongoose";

const sentMailSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    credId: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    from: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    to: {
        type: Array,
        required: true,
        trim: true,
        minLength: 1,
    },
    accepted: {
        type: Array,
        required: true,
        trim: true,
        minLength: 1,
    },
    rejected: {
        type: Array,
        required: true,
        trim: true,
        minLength: 1,
    },
    response: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    envelope: {
        type: Object,
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
    templateId: {
        type: String, 
        required: true,
        trim: true,
        minLength: 1,
    },
    status: {
        type: String, 
        required: true,
        trim: true,
        minLength: 1,
    },
    opened: {
        type: Boolean, 
        required: true,
        trim: true,
        minLength: 1,
    },
    uniqueIdforTracking: {
        type: String, 
        required: true,
        trim: true,
        minLength: 1,
    },
}, {
    collection: 'sent-mails',
    timestamps:true
});

const sentMails = mongoose.model('SentMail', sentMailSchema);

export default sentMails;