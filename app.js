const express = require("express");
var app = express();    // nodejs express의 디폴트 포트번호는 3000번
const path = require("path");

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(8080,() => console.log(`Listening port on : 8080`));    // 소켓 서버 포트는 8080으로 설정함
 
// 세션 설정
var session = require("express-session")({                                            
  secret:"my-secret",
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:60000}
});

app.use(session);
 
// 소켓 구문 시작 =================================================
var ios = require("express-socket.io-session"); // 소켓 내에서 세션데이터 접근 가능하도록하는 모듈
io.use(ios(session, { autoSave:true }));  // 모듈과 세션 연결


io.sockets.on('connection', function(socket){
  // 클라이언트에게 메세지 송신 방법
  // io.emit  == 접속된 모든 클라이언트에게 메세지 전송
  // socket.emit    == 메세지를 전송한 클라이언트에게만 전송
  // io.to(id).emit == 특정 클라이언트에게만 메세지 전송 (본인 포함)
  // socket.broadcast.to(id).emit == 본인은 제외한 특정 클라이언트에게만 전송
  // socket.emit('message', '서버 데이터 받음');
  // socket.on('이벤트명',기능 서술) == 서버 또는 클라이언트에서 메세지를 받는 방식

  if(socket.handshake.session.nickname){
    console.log("세션에 유저의 정보가 이미 저장됨: ",socket.handshake.session.nickname);
    socket.emit("login",({nickname:socket.handshake.session.nickname, img:socket.handshake.session.img}));
  };
 
 
  // 클라이언트에서 'login'이라는 이벤트명으로 서버로 송신하면 여기로....
  // 접속한 클라이언트의 정보가 수신
  socket.on('login', function(data) {
    let resultData ={};
    socket.nickname = data.nickname;
    socket.img = data.img;
    resultData.result = true;
    resultData.name = data.nickname;
    resultData.msg = `Hi ${socket.nickname} !`;
    resultData.img = data.img;
    console.log(resultData);
    console.log(
      `login success, socketID: ${socket.id}, nickname: ${socket.nickname}, img:${resultData.img}`
    );


    console.log('########클라이언트 로그인########');
    socket.handshake.session.nickname=data.nickname;    // <======= 소켓 내에서 세션에 접근 
    socket.handshake.session.img=data.img; // <======= 소켓 내에서 세션에 접근 
    console.log('session 사원 닉네임 : '+ socket.handshake.session.nickname + " || " +'session 사원 이미지 : '+ socket.handshake.session.img);


    socket.emit("login-result", resultData);
  });
});



app.use(express.static(path.join(__dirname, "public")));
