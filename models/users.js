import mongoose from 'mongoose'
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email, mobileNumber: this.mobileNumber },
        process.env.JWT_SECRET
    );
    return token;
};

export default mongoose.model('User', userSchema)