// Avatar를 선택
function selAvatar(id){
  var list=document.querySelectorAll("#avata > li")
  list.forEach(element => {
    if(element.id==id){
      if(element.className=="selected"){
        element.className=""
      }else{
        element.className="selected"
      }
    }else{
      element.className=""
    }
  });

}

//선택한 Avatar의 id를 리턴, 선택하지 않은 경우 X 리턴
function checkAvatar(){
  var list=document.querySelectorAll("#avata > li")
  var retValue="X"
  list.forEach(element => {
    if(element.className=="selected"){
      retValue=element.id
    }
  });
  return retValue
}



var loginForm = document.getElementById('loginForm');
var nicknameInput = document.getElementById('nickname');
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (nicknameInput.value) {
    let val=checkAvatar()
    if(val!="X"){
      socket.emit('login',{
        nickname:nicknameInput.value,
        img:val        
      })
    }else{ // avatar를 선택하지 않고 submit 누른 경우
      alert("Select Avatar")
    }
  }else{ // nickname을 입력하지 않고 submit 누른 경우
    alert("Input nickname")
  }
});


socket.on('login-result',(data)=>{
  if(!data.result) //로그인 실패
    alert(data.msg);
  else{ // 로그인 성공
    alert(data.msg) 
    }
})