
if(window.location.href!="http://pontifo.herokuapp.com/")
  window.urprefix="http://pontifo.herokuapp.com";
else
  window.urprefix="";

(function(){
window.dloc=document.createElement("div");
window.dloc.id="something";
var hd=document.createElement("h2");
hd.innerText="Pontifo!";
window.dloc.appendChild(hd);
var scorer=document.createElement("div");
scorer.id="scorer";
window.dloc.appendChild(scorer);
document.body.appendChild(window.dloc);})();

(function(){
  return false;
var mds=document.createElement("script");
mds.src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js";
document.body.appendChild(mds);})();


window.dloc=document.getElementById("something");

window.newgame=function(){
  if(window.qobjs==undefined){
    window.qobjs=[];}
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4){
      if(window.qobjs==undefined)
        window.qobjs=[];
      window.qobjs.push(JSON.parse(this.responseText));
      window.showquestion(window.qobjs.length-1);
    }
  };
  xhr.open("GET",window.urprefix+( (!window.qobjs.length||window.urprefix!="") ? "/game/new" : "/game/next_quote" ));
  xhr.send();
};

(function(){
  var ss=document.createElement("style");
  ss.type="text/css";
  var txt="*{font-family:sans-serif;}";
  txt+="#something h2{text-align:center;background:#DDDDFF;}";
  txt+="#something{display:block;max-width:600px;width:80%;margin:0 auto;}";
  txt+=".question{font-size:120%;margin-bottom:.5em;}";
  txt+=".question input{width: 5em;vertical-align:middle;margin-right:.5em;}";
  txt+=".question .qpart{vertical-align:middle;display:inline-block;}";
  txt+=".questionall img{ max-width:100%;}";
  txt+=".questionall .imgholder{display:inline-block;width:20%;}";
  txt+=".questionall .question{ display:inline-block;width:70%;padding-left:5%;padding-right:5%;vertical-align:top;}";
  txt+=".questionall:last-child {margin-bottom:5em;}";
  txt+=".character, .speaker, .from{font-size:75%;color:#888888;}";
  if(false)
    txt+=".congrats:after{content:\"!\";}"
  txt+=".comment{color:red;font-size:200%;text-transform:uppercase;}";
  ss.innerHTML=txt;
  document.body.appendChild(ss);
  newgame();
})();
window.startgame=function(){
  if(window.qobjs.length>0)
    window.showquestion(0);
  else
    console.log("err");
};

window.showquestion=function(id){
  var qobj=window.qobjs[id];
  var dobj=document.createElement("form");
  var dstr="<div class=imgholder>";
  if(qobj.movie_img_url!=undefined&&/pontifo/.test(qobj.movie_img_url))
    dstr+="<img src='"+qobj.movie_img_url+"'>";
  if(qobj.actor_img_url!=undefined&&/pontifo/.test(qobj.actor_img_url))
    dstr+="<br><img src='"+qobj.actor_img_url+"'>";
  dstr+="</div><div class=question id='qid-"+id+"'>";
  for (var i = 0; i <= qobj.tokens.length; i++) {
    if(i==qobj.removed)
      dstr+="<input type=text name='replaced-q"+id+"'>";
    if(i==qobj.tokens.length)
      break
    var tin=qobj.tokens[i];
    dstr+=tin+" ";
    };
  dstr+="</div>";
  var fields=["character","speaker","from"];
  for (var i = 0; i < fields.length; i++) {
    dstr+="<div class="+fields[i]+">"+qobj[fields[i]]+"</div>";
    };
  dstr+="</form>";
  if(false){
    var check=document.createElement("input");
    check.type="button";}
  dobj.onsubmit=function(qid){
    return function(evt){
      evt.preventDefault();
      var atotry=document.querySelector("input[name=replaced-q"+qid+"]");
      window.tryanswer(atotry.value,qid);
    };}(id);
  dobj.className="questionall";
  dobj.id="qallid-"+id;
  dobj.innerHTML=dstr;
  if(false)
    dobj.appendChild(check);
  window.dloc.appendChild(dobj);
  document.querySelector("input[name=replaced-q"+id+"]").focus();
  window.scrollTo(0,document.body.offsetHeight);
  this.onsubmit=function(evt){evt.preventDefault();};
};

window.tryanswer=function(ans,id){
  var qall=window.qobjs[id].text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  var tocomp="";
  for (var i = 0; i <= window.qobjs[id].tokens.length; i++) {
    if(window.qobjs[id].removed==i){
      tocomp+=(ans.replace(/[^a-zA-Z0-9]/, ""));
    }
    if(i==window.qobjs[id].tokens.length)
      break
    tocomp+=window.qobjs[id].tokens[i].replace(/[^a-zA-Z0-9]/g, "");
  };
  tocomp=tocomp.toLowerCase();

  var congrats=document.createElement("div");
  congrats.className="congrats";
  if(false)
    var mhash=window.CryptoJS.MD5(tohash);
  if(tocomp==qall){
    congrats.innerText="Correct!";
    congrats.style.color="green";
    congrats.style.fontSize="100%";
    congrats.style.textTransform="uppercase";
    window.qobjs[id].correct=true;
  }
  else{
    window.qobjs[id].correct=false;
    congrats.innerText="Go fuck yourself";
    congrats.style.color="red";
    congrats.style.fontSize="200%";
    congrats.style.textTransform="uppercase";
  }
  document.getElementById("something").appendChild(congrats);
  if(window.qobjs.length%10==0){
    var score=0;
    for (var i = -9; i < 1; i++) {
      if(window.qobjs[id+i].correct)
        score++;
    };
    var scoreobj=document.createElement("div");
    scoreobj.className="score";
    scoreobj.innerHTML="You got "+score+"/10 correct"+((score!=10)? "<div class=comment>Go fuck yourself, Andrew</div>" : "");
    var restart=document.createElement("input");
    restart.onclick=function(){
      newgame();
      this.remove();
    };
    restart.type="button";
    restart.value="Play Again?";
    window.dloc.appendChild(scoreobj);
    window.dloc.appendChild(restart);
    }
  else
    newgame();

  document.getElementById("qallid-"+id).remove();

};
