import mongoose from 'mongoose';
import {UserInterface} from '../config/newUserInterface'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add your name"],
        trim: true,
        maxLength: [20, "Max of 20 characters reached"]
    },
    account: {
        type: String,
        rquired: [true, "Please add your email or phone"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please add your password"]
    },
    avatar: {
        type: String,
        default:  'https://res.cloudinary.com/guygreenleaf/image/upload/v1622489463/samples/animals/cat.jpg'
    },
    role: {
        type: String,
        default: 'user' // or admin!
    },
    type: {
        type: String,
        default: 'normal' // 
    }
}, {
    timestamps: true
})

export default mongoose.model<UserInterface>('User', userSchema )