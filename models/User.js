const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    //unique는 중복 제거
    email: {
        type:String,
        trim: true,
        unique: 1
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    //권한
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type:Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}