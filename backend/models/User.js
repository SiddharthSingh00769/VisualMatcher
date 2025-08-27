import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
}, {
    timestamps: true,
});

// A Mongoose pre-save hook that runs before the document is saved.
// This is where we hash the password.
UserSchema.pre('save', async function(next) {
    // Only hash if the password has been modified or is new
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Generate a salt. The number 10 is the cost factor.
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); 
    } catch (err) {
        next(err); 
    }
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
