const GET_TOKEN = "https://vrchat.com/api/1/auth";
const GET_FRIENDS = "https://vrchat.com/api/1/auth/user/friends?n=100";
var token = "";
var friendsList;
//読み込み終了時リスナー
window.addEventListener('load', () => getToken(), false);

//トークン取得
const getToken = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", GET_TOKEN);
  xhr.send();
  xhr.onload = () =>{
      if (xhr.readyState == 4 && xhr.status == 200) {
          const DATA = xhr.response;
          const JSON_DATA = JSON.parse(DATA);
          token = JSON_DATA.token
        } else {
          console.log(`Error: ${xhr.status}`);
        }
  }
  getOnlineFriends();
};

const getOnlineFriends = () => {
  var count = 100;
  var url = GET_FRIENDS;
  var jsonData;
  fetchFriends(url).then(result => {
    console.log(result);
    friendsList = result;
  })
  .catch(error => {console.error(error)});
};

const fetchFriends = async (url) => {
  var jsonData = [];
  var elementNum = 100;
  for(let i=0;i<5;i++){
    if(elementNum >= 100){
      const RESPONCE = await fetch(GET_FRIENDS);
      const JSON_DATA = await RESPONCE.json();
      elementNum = Object.keys(JSON_DATA).length;
      console.log(elementNum);
      jsonData.push(JSON_DATA);
    }else{
      break;
    }
  }
  return jsonData;
};


