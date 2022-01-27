const mongoose = require("mongoose")
const createError = require("http-errors")
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
},{collection: "user" ,timestamps: true})

userSchema.statics.login = async (userName, password) => {
    const user = await users.findOne({userName: userName})

    if (!user) {
        throw createError(404, "Username yada şifre yanlış")
    }

    const passwordCheck = await bcrypt.compare(password, user.password)

    if (!passwordCheck) {
        throw createError(400,"Şifre Hatalıdır")
    }

    return user

}


const users = mongoose.model("users",userSchema)

module.exports = users