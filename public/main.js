function load_github() {
  let url = get_true_url(document.URL);
  window.location.href= `https://github.com/login/oauth/authorize?client_id=40496946a2c62c5b2422&scope=user,public_repo&redirect_uri=${url}`;
}
let code = getQueryVariable('code');
if (code){
  axios.get(`https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=40496946a2c62c5b2422&client_secret=2eead5d61f71d13a1afd1aee0375beb1c74a389f&code=${code}`).then((res)=>{
    if (res.status===200){
      let str = res.data;
      const regex = /access_token=(.*)&scope=/gm;
      while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        console.log(m[1]);
        localStorage.setItem('GT_ACCESS_TOKEN',m[1]);
      }
    }
    window.location.href = get_true_url(document.URL);
  });
}else {
  window.location.href = get_true_url(document.URL);
}

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] === variable){return pair[1];}
  }
  return undefined;
}

function get_true_url(url) {
  return url.split('?')[0]
}
