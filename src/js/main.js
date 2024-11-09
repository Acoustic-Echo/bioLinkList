const GET_TOKEN = "https://vrchat.com/api/1/auth";
const GET_FRIENDS = "https://vrchat.com/api/1/auth/user/friends?n=100";
var token = "";
var onlineFriendsList = [];
var offlineFriendsList = [];
var friendsList = [];
var twitter = new Array();
var filTwitterList = [];
//読み込み終了時リスナー
window.addEventListener('load', () => getToken(), false);

//トークン取得
const getToken = async () => {
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
  await getFriends();
  getTwitterLink();
  filTwitterList = await filteredTwList(twitter);
  test();
};

//フィールド値チェック
const test = () => {
  console.log(onlineFriendsList);
  console.log(offlineFriendsList);
  console.log(friendsList);
  console.log(twitter);
  console.log(filTwitterList);
}

const getTwitterLink = () =>{
  for(let i = 0; i < friendsList.length; i++){
    var filteredLinkList = [];
    var linkList = friendsList[i].bioLinks;
    if(linkList != null){
      for(let j = 0; j < linkList.length; j++){
        if(linkList[j].includes("twitter.com") || linkList[j].includes("x.com")){
          filteredLinkList.push(linkList[j]);
        }
      }
    }
    twitter.push([friendsList[i].displayName,filteredLinkList]);
  }
}

const filteredTwList = (list) =>{
  var newList=[];
  for(let i = 0; i < list.length;i++){
    if((list[i])[1].length != 0){
      newList.push(list[i]);
    }
  }
  return newList;
}

//フレンドリスト取得
const getFriends = async () =>{
  await getOnlineFriends();
  await getOfflineFriends();
  friendsList = onlineFriendsList.concat(offlineFriendsList);
}


//オンラインフレンド取得
const getOnlineFriends = async () => {
  var url = GET_FRIENDS;
  url += "&offline=false";
  await fetchFriends(url).then(result => {
    const resCount = Object.keys(result).length;
    for(let i=0;i<resCount;i++){
      onlineFriendsList = onlineFriendsList.concat(result[i]);
    }
  })
  .catch(error => {console.error(error)});
};

//オフラインフレンド取得
const getOfflineFriends = async () => {
  var url = GET_FRIENDS;
  url += "&offline=true";
  await fetchFriends(url).then(result => {
    const resCount = Object.keys(result).length;
    for(let i=0;i<resCount;i++){
      offlineFriendsList = offlineFriendsList.concat(result[i]);
    }
  })
  .catch(error => {console.error(error)});
};

//フレンド取得API
const fetchFriends = async (url) => {
  var jsonData = [];
  var elementNum = 100;
  var count = 0;
  var countUrl = url;
  for(let i=0;i<5;i++){
    if(elementNum >= 100){
      const RESPONCE = await fetch(countUrl);
      const JSON_DATA = await RESPONCE.json();
      elementNum = Object.keys(JSON_DATA).length;
      count += elementNum;
      countUrl = url + "&offset=" + (count+1);
      jsonData.push(JSON_DATA);
    }else{
      break;
    }
  }
  return jsonData;
};


