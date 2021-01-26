//index.js

const express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
const app = express(); //express를 실행하여 app object를 초기화 합니다.
const port = 8000; // 사용할 포트 번호를 port 변수에 넣습니다. 
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => { // '/' 위치에 'get'요청을 받는 경우,
  res.send('Hello World! Nodemon Test'); // "Hello World!"를 보냅니다.
})

app.post('/register', (req, res) => {

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
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

const server = app.listen(port, () => { // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log('server on! http://localhost:'+port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
})