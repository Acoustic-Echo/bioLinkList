const GET_FRIENDS = "https://vrchat.com/api/1/auth/user/friends?n=100";
//オンラインフレンドリスト
var onlineFriendsList = [];
//オフラインフレンドリスト
var offlineFriendsList = [];
//フレンドリスト
var friendsList = [];
//ツイッターリンクリスト
var twitter = [];
//フィルター後のフレンドリスト
var filTwitterList = [];
//フレンドリスト最大取得数(オンライン,オフライン別)
var max =1000;

//読み込み終了時リスナー
window.addEventListener('load', () => start(), false);

//トークン取得
const start = async () => {
  await getFriends();
  filteredTwitterLink();
  filTwitterList = await filteredExistTwList(twitter);
  test();
  lordTwList();
};

//ツイッターリストロード
const lordTwList = () => {
  var addHtml ='<div id="tw-list">';
  for(let i=0;i<filTwitterList.length;i++){
    var value="<p id=tw"+i+">";
    value += (i+1)+": Name:"+filTwitterList[i][0];
    var list = filTwitterList[i][1];
    for(let j=0; j<list.length;j++){
      value += " Link"+(j+1)+':<a href="'+list[j]+'">' + list[j] + "</a>";
    }
    value+="</p><br>"
    addHtml += value;
  }
  addHtml += "</div>";
  console.log(addHtml);
}

//フィールド値チェック
const test = () => {
  console.log(onlineFriendsList);
  console.log(offlineFriendsList);
  console.log(friendsList);
  console.log(twitter);
  console.log(filTwitterList);
}

//ツイッターリンクのリストフィルター
const filteredTwitterLink = () =>{
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

//リンクが存在するフレンドのみに絞り込み
const filteredExistTwList = (list) =>{
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
  for(let i=0;i<(max/100);i++){
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


