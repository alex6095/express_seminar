//index.js

const express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
const app = express(); //express를 실행하여 app object를 초기화 합니다.
const port = 8000; // 사용할 포트 번호를 port 변수에 넣습니다. 

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://alex6095:Sa9612266095@fresh-man.i5xks.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => { // '/' 위치에 'get'요청을 받는 경우,
  res.send('Hello World!'); // "Hello World!"를 보냅니다.
})

const server = app.listen(port, () => { // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log('server on! http://localhost:'+port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
})