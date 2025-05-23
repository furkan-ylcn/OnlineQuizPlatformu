const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
    type: String,
    required: true,
    unique: true
    },
    email: {
    type: String,
    required: true,
    unique: true
    },
    password: {
    type: String,
    required: true
    },
    role: {
    type: String,
    enum: ["player", "instructor"],
    default: "player"
    },
    createdAt: {
    type: Date,
    default: Date.now()
    }
});

// Hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
        try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;