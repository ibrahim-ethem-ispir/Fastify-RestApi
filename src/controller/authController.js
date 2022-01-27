const users = require("../model/userModel")
const bcrypt = require("bcrypt")
const createError = require("http-errors")

const allUsers = async (req,reply) => {
    try {
        const _foundUsers  = await users.find()
        return _foundUsers 
    } catch (err) {
        throw createError(400, "Kayıtlar Getirilirken Hata ile Karşılaşıldı"+err)
    }
}

const singleUser = async (req, reply) => {
    try {
        const userId = req.params.userId
        const user = await users.findById(userId)
        return user
    } catch (err) {
        throw createError(400,"Kullanıcı Bulunamadı"+err)
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
        return user
    } catch (err) {
        throw createError(400, err)
    }
}

module.exports = {
    allUsers,
    singleUser,
    register,
    login
}