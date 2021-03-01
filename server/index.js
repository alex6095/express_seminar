//index.js

const express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
const app = express(); //express를 실행하여 app object를 초기화 합니다.
const port = 8000; // 사용할 포트 번호를 port 변수에 넣습니다.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  // '/' 위치에 'get'요청을 받는 경우,
  res.send('Hello World! Nodemon Test'); // "Hello World!"를 보냅니다.
});

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요~")
})

app.post('/api/users/register', (req, res) => {
  //회원가입 정보 클라에서 가져오면 DB에 넣는다
  /*
  req.body의 형태
  {
    id: "hello",
    password: "123"
  }
  */

  const user = new User(req.body);

  //MongoDB 메소드 save
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  //post된 email을 DB에서 탐색, 있을시 password 대조
  //비밀번호 일치 시 토큰 생성
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'No such user.',
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });

      user.genToken((err, user) => {
        if (err) return res.status(400).send(err);

        //Token을 쿠키에 저장
        res
          .cookie('user_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userID: user._id });
      });
    });
  });
});

// role 설정해주자
app.get('/api/users/auth', auth, (req, res) => {
  //middleware auth 통과 시 Authentication이 True
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

const server = app.listen(port, () => {
  // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log('server on! http://localhost:' + port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
});
