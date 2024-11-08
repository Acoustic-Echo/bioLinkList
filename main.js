const GET_TOKEN = "https://vrchat.com/api/1/auth";
var token = "";
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
            ;
          } else {
            console.log(`Error: ${xhr.status}`);
          }
    }
};