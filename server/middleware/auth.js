const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증과정
    //Client Cookie의 Token 가져오기
    let token = req.cookies.user_auth;

    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user)   return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };