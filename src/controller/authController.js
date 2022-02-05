const users = require("../model/userModel")
const bcrypt = require("bcrypt")
const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const fastify = require('fastify')()


const allUsers = async (req,reply) => {
    try {
        const _foundUsers  = await users.find()
        return _foundUsers 
    } catch (err) {
        throw createError(400, "Kayıtlar Getirilirken Hata ile Karşılaşıldı"+err)
    }
    // burada yetki kontrolü yapabiliriz. Schema ya yetki alanı ekle
}

const singleUser = async (req, reply) => {
    try {
        const verifyToken = jwt.verify(req.cookies.token_key,process.env.JWT_TOKEN_KEY)
        console.log(verifyToken);
        if (verifyToken.isEmail === true) {
            const userId = req.params.userId
            const user = await users.findById(userId)
            return user
        }
        else if (verifyToken.isEmail === false) {
            return createError(400,"Lütfen emailinizi onaylayın")
        }
        else {
            return createError(400,"Lütfen önce oturum açın")
        }
    } catch (err) {
        throw createError(400,"Kullanıcı Bulunamadı === "+err)
    }
}

const register = async (req, reply) => {
    reply.header("Access-Control-Allow-Origin", "*")
    reply.header("Access-Control-Allow-Methods","POST")
    try {
        const newUser = new users({
            userName: req.body.userName,
            email: req.body.email,
            password:  await bcrypt.hash(req.body.password, 10)
        })

        return await newUser.save()
    } catch (err) {
        throw createError(400, "Kullanıcı kayıt olurken hata çıktı === "+err)
    }
}

const login = async (req, reply) => {
    reply.header("Access-Control-Allow-Origin", "*")
    reply.header("Access-Control-Allow-Methods","POST")
    try {
        const user = await users.login(req.body.userName, req.body.password)
        const tokenInfo = {
            id: user._id,
            email: user.email,
            isEmail: user.isEmail
        }

        const token = jwt.sign(tokenInfo, process.env.JWT_TOKEN_KEY,{expiresIn:process.env.TOKEN_EXPIRE})

        reply.cookie("token_key",token)
        reply.send({token})
    } catch (err) {
        throw createError(400, err)
    }
}

/*
const admin = (req,reply) => {
    const jwtVerify = jwt.verify(req.user.token, process.env.TOKEN_KEY)
}*/

module.exports = {
    allUsers,
    singleUser,
    register,
    login
}