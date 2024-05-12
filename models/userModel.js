const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const {trackitDB} = connectDBs()

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide username"],
    },
    
    userId:{
        type: String,
    },

    accessToken: { type: String },
    refreshToken: { type: String },

},
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRE,
    });
};
UserSchema.methods.getSignedRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRE,
    });
};

module.exports = mongoose.model('User',UserSchema)
