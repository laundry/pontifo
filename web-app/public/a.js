

window.attachscore=function(index,ans,real){
  if(ans==real){
    window.qobjs[index].score=10;
    window.updatescore(index);
    return;
  }
  window.qobjs[index].computing=true;
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4){
      window.qobjs[index].score=Math.round(11*(Math.pow(.843,parseInt(this.responseText)))-1);
      window.updatescore(index);
    }
  };
  xhr.open("GET","http://pontifo-svc.herokuapp.com/relation-score?one="+ans+"&two="+real);
  xhr.send();
}
window.updatescore=function(index){
  var total=0;
  for (var i = 0; i <= index%10; i++) {
    total+=window.qobjs[index-i].score;
  };
  document.getElementById("scorer").innerHTML=total;
};

window.newgame=function(){
  if(window.qobjs==undefined){
    window.qobjs=[];}
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4){
      if(window.qobjs==undefined)
        window.qobjs=[];
      window.qobjs.push(JSON.parse(this.responseText));
      window.clears();
      window.showquestion(window.qobjs.length-1);
    }
  };
  xhr.open("GET",window.urprefix+( (!window.qobjs.length||window.urprefix!="") ? "/game/new" : "/game/next_quote" ));
  xhr.send();
};


window.clears=function(){
  document.getElementById("something").innerHTML="";
}

window.titlescreen=function(){
  var str="<div class=titlescreen><h4>Welcome To</h4><h1>iPontof</h1></div><input type=button onclick='newgame()' value='Start Game'>";
  document.getElementById("something").innerHTML=str;
}

window.startgame=function(){
  if(window.qobjs.length>0)
    window.showquestion(0);
  else
    console.log("err");
};

window.clearscores=function(){
  document.getElementById("scorer").innerHTML="";
  document.getElementById("status").innerHTML="";
};

window.showquestion=function(id){
  if(id%10==0)
    window.clearscores();
  var qobj=window.qobjs[id];
  var dobj=document.createElement("form");
  var dstr="<div class=minfo>";
  dstr+="<div class=imgholder>";
  if(qobj.movie_img_url!=undefined&&/pontifo/.test(qobj.movie_img_url))
    dstr+="<img src='"+qobj.movie_img_url+"'>";
  dstr+="<div class=from>"+qobj.from+"</div></div>";
  dstr+="<div class=imgholder>";
  if(qobj.actor_img_url!=undefined&&/pontifo/.test(qobj.actor_img_url))
    dstr+="<img src='"+qobj.actor_img_url+"'>";
  dstr+="<div class=speaker>"+qobj.speaker+"</div>";
  dstr+="<div class=character>"+qobj.character+"</div>";
  dstr+="</div></div><div class=question id='qid-"+id+"'>";
  for (var i = 0; i <= qobj.tokens.length; i++) {
    if(i==qobj.removed_index)
      dstr+="<input type=text name='replaced-q"+id+"'>";
    if(i==qobj.tokens.length)
      break
    var tin=qobj.tokens[i];
    dstr+=tin+" ";
    };
  dstr+="</div>";
  var fields=[];
  for (var i = 0; i < fields.length; i++) {
    dstr+="<div class="+fields[i]+">"+qobj[fields[i]]+"</div>";
    };
  dstr+="</div>";
  dobj.onsubmit=function(qid){
    return function(evt){
      evt.preventDefault();
      var atotry=document.querySelector("input[name=replaced-q"+qid+"]");
      window.tryanswer(atotry.value,qid);
    };}(id);
  dobj.className="questionall";
  dobj.id="qallid-"+id;
  dobj.innerHTML=dstr;
  window.dloc.appendChild(dobj);
  document.querySelector("input[name=replaced-q"+id+"]").focus();
  window.scrollTo(0,document.body.offsetHeight);
};

window.tryanswer=function(ans,id){
  var qall=window.qobjs[id].removed_token.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  var tocomp=ans.replace(/[^a-zA-Z0-9]/, "");
  tocomp=tocomp.toLowerCase();

  var congrats=document.createElement("div");
  congrats.className="congrats";
  var actual="";
  window.attachscore(id,tocomp,qall);
  if(tocomp==qall){
    congrats.innerText="Correct!";
    congrats.style.color="green";
    congrats.style.fontSize="100%";
    congrats.style.textTransform="uppercase";
    window.qobjs[id].correct=true;
  }else{
    window.qobjs[id].correct=false;
    congrats.innerText="Wrong";
    congrats.style.color="red";
    congrats.style.fontSize="100%";
    congrats.style.textTransform="uppercase";
    var bstr="";
    for (var i = 0; i < window.qobjs[id].tokens.length; i++) {
      if(i==window.qobjs[id].removed_index)bstr+="<strong>"+window.qobjs[id].removed_token+"</strong> ";
        bstr+=window.qobjs[id].tokens[i]+" ";
    };
    bstr=bstr.substring(0,bstr.length-1-1);
    actual+="The real answer is <br>"+bstr+"<br>You put <strong>\""+ans+"\"</strong>";
  }
  document.getElementById("status").innerHTML="";
  if(actual!=""){
    var tmp=document.createElement("div");
    tmp.innerHTML=actual;
    document.getElementById("status").appendChild(tmp);}
  document.getElementById("status").appendChild(congrats);

  if(window.qobjs.length%10==0){
    var score=0;
    for (var i = -9; i < 1; i++) {
      if(window.qobjs[id+i].correct)
        score++;
    };
    var scoresub=document.createElement("form");
    scoresub.onsubmit=window.submitscore;
    scoresub.id="subuname";
    scoresub.innerHTML="<input id=uname placeholder='Your name' type=text>";
    var tmp=document.createElement("input");
    tmp.type="button";tmp.value="Submit";
    tmp.onclick=window.submitscore;
    scoresub.appendChild(tmp);
    var scoreobj=document.createElement("div");
    scoreobj.className="score";
    scoreobj.innerHTML="You got "+score+"/10 correct"+((score!=10)? "<div class=comment>=C</div>" : "");
    var restart=document.createElement("input");
    restart.onclick=function(){
      newgame();
      this.remove();
    };
    restart.type="button";
    restart.value="Play Again?";
    window.dloc.appendChild(scoreobj);
    window.dloc.appendChild(scoresub);
    window.dloc.appendChild(restart);
    }
  else
    newgame();

  document.getElementById("qallid-"+id).remove();

};

window.submitscore=function(evt){
  evt.preventDefault();
  var uname=document.getElementById("uname").value;
  var xhr=new XMLHttpRequest();
  var url=window.urprefix+"/game/save";
  xhr.open("GET",url+"?"+"name="+uname+"&score="+parseInt(document.getElementById("scorer").innerHTML));
  xhr.onreadystatechange=function(){
    if (xhr.readyState==4){
      window.location.href="/leaderboard"
    }
  }
  xhr.send();
  document.getElementById("subuname").remove();
};



(function(){
if(window.location.pathname!="/")
  return false;
if(window.location.href!="http://pontifo.herokuapp.com/")
  window.urprefix="http://pontifo.herokuapp.com";
else
  window.urprefix="";
var hd=document.createElement("h2");
hd.innerText="Pontifo!";
window.dloc=document.getElementById("something");
document.getElementById("persistent").appendChild(hd);
var scorer=document.createElement("div");
scorer.id="scorer";
document.getElementById("persistent").appendChild(scorer);
titlescreen();
})();
