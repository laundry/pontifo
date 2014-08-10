window.d=document;
window.d.gebi=window.d.getElementById;
window.intf={};
if(window.history.pushState==undefined)
  window.history.pushState=function(){};
window.rm=function(obj){
  if(obj.remove!=undefined)
    obj.remove();
  else
    obj.parentNode.removeChild(obj);
};
window.ael=function(obj,evt,fnc){
  var altevent=null;
  if(obj==window&&evt=="load"){
    altevent="DOMContentLoaded";
  }
  if(obj.addEventListener!=undefined){
    if(altevent==null)
      obj.addEventListener(evt,fnc,false);
    else
      obj.addEventListener(altevent,fnc,false);
  } else if(obj.attachEvent!=undefined){
    obj.attachEvent("on"+evt,fnc);
  } else if(obj["on"+evt]==null){
    obj["on"+evt]=fnc;
  } else if(obj["on"+evt]!=null){
    var oldfnc=obj["on"+evt];
    obj["on"+evt]=function(event){
      oldfnc(event);
      fnc(event);
    }
  }
};
window.preventDefault=function(evt){
  if(evt.preventDefault!=undefined)
    evt.preventDefault();
  else
    evt.returnValue=false;
};
if(window.JSON==undefined){
  window.JSON={parse:function(input){
    var tempobj={};
    if(!/[;|=]/.test(input))
      eval("tempobj="+input+";")
    return tempobj;
  }};
}

intf.attachscore=function(index,ans,real){
  if(ans==real){
    intf.qobjs[index].score=10;
    intf.updatescore(index);
    return;
  }
  intf.qobjs[index].computing=true;
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4){
      intf.qobjs[index].score=Math.round(11*(Math.pow(.843,parseInt(this.responseText)))-1);
      intf.updatescore(index);
    }
  };
  xhr.open("GET","http://pontifo-svc.herokuapp.com/relation-score?one="+ans+"&two="+real);
  xhr.send();
}
intf.updatescore=function(index){
  var total=0;
  for (var i = 0; i <= index%10; i++) {
    total+=intf.qobjs[index-i].score;
  };
  d.gebi("scorer").innerHTML=total;
};

intf.newgame=function(){
  if(intf.qobjs==undefined){
    intf.qobjs=[];}
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4){
      if(intf.qobjs==undefined)
        intf.qobjs=[];
      intf.qobjs.push(JSON.parse(this.responseText));
      intf.clears();
      intf.showquestion(intf.qobjs.length-1);
    }
  };
  xhr.open("GET",intf.urprefix+( (!intf.qobjs.length||intf.urprefix!="") ? "/game/new" : "/game/next_quote" ));
  xhr.send();
};


intf.clears=function(){
  d.gebi("something").innerHTML="";
}

intf.titlescreen=function(){
  var str="<div class=titlescreen><h4>Welcome To</h4><h1>iPontof</h1></div><input id=restartbutton type=button onclick='intf.newgame()' value='Start Game'>";
  d.gebi("something").innerHTML=str;
  d.gebi("restartbutton").focus();
}

intf.startgame=function(){
  if(intf.qobjs.length>0)
    intf.showquestion(0);
  else
    console.log("err");
};

intf.clearscores=function(){
  d.gebi("scorer").innerHTML="";
  d.gebi("status").innerHTML="";
};

intf.showquestion=function(id){
  if(id%10==0)
    intf.clearscores();
  var qobj=intf.qobjs[id];
  var dobj=d.createElement("form");
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
  ael(dobj,"submit",function(qid){
    return function(evt){
      preventDefault(evt);
      var atotry=d.querySelector("input[name=replaced-q"+qid+"]");
      intf.tryanswer(atotry.value,qid);
    };}(id));
  dobj.className="questionall";
  dobj.id="qallid-"+id;
  dobj.innerHTML=dstr;
  intf.dloc.appendChild(dobj);
  d.querySelector("input[name=replaced-q"+id+"]").focus();
  window.scrollTo(0,d.body.offsetHeight);
};

intf.tryanswer=function(ans,id){
  var qall=intf.qobjs[id].removed_token.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  var tocomp=ans.replace(/[^a-zA-Z0-9]/, "");
  tocomp=tocomp.toLowerCase();

  var congrats=d.createElement("div");
  congrats.className="congrats";
  var actual="";
  intf.attachscore(id,tocomp,qall);
  if(tocomp==qall){
    congrats.innerText="Correct!";
    congrats.style.color="green";
    congrats.style.fontSize="100%";
    congrats.style.textTransform="uppercase";
    intf.qobjs[id].correct=true;
  }else{
    intf.qobjs[id].correct=false;
    congrats.innerText="Wrong";
    congrats.style.color="red";
    congrats.style.fontSize="100%";
    congrats.style.textTransform="uppercase";
    var bstr="";
    for (var i = 0; i < intf.qobjs[id].tokens.length; i++) {
      if(i==intf.qobjs[id].removed_index)bstr+="<strong>"+intf.qobjs[id].removed_token+"</strong> ";
        bstr+=intf.qobjs[id].tokens[i]+" ";
    };
    bstr=bstr.substring(0,bstr.length-1-1);
    actual+="The real answer is <br>"+bstr+"<br>You put <strong>\""+ans+"\"</strong>";
  }
  d.gebi("status").innerHTML="";
  if(actual!=""){
    var tmp=d.createElement("div");
    tmp.innerHTML=actual;
    d.gebi("status").appendChild(tmp);}
  d.gebi("status").appendChild(congrats);

  if(intf.qobjs.length%10==0){
    var score=0;
    for (var i = -9; i < 1; i++) {
      if(intf.qobjs[id+i].correct)
        score++;
    };
    var scoresub=d.createElement("form");
    ael(scoresub,"submit",intf.submitscore)
    scoresub.id="subuname";
    scoresub.innerHTML="<input id=uname placeholder='Your name' type=text>";
    var tmp=d.createElement("input");
    tmp.type="button";tmp.value="Submit";
    ael(tmp,"click",intf.submitscore);
    scoresub.appendChild(tmp);
    var scoreobj=d.createElement("div");
    scoreobj.className="score";
    scoreobj.innerHTML="You got "+score+"/10 correct"+((score!=10)? "<div class=comment>=C</div>" : "");
    var restart=d.createElement("input");
    restart.id="restartbutton";
    ael(restart,"click",function(){
      intf.newgame();
      rm(restart);
    });
    restart.type="button";
    restart.value="Play Again?";
    intf.dloc.appendChild(scoreobj);
    intf.dloc.appendChild(scoresub);
    intf.dloc.appendChild(restart);
    d.gebi("uname").focus();
    }
  else
    intf.newgame();

  rm(d.gebi("qallid-"+id));

};

intf.submitscore=function(evt){
  preventDefault(evt);
  var uname=d.gebi("uname").value;
  var xhr=new XMLHttpRequest();
  var url=intf.urprefix+"/game/save";
  xhr.open("GET",url+"?"+"name="+uname+"&score="+parseInt(d.gebi("scorer").innerHTML));
  var form=d.gebi("subuname");
  var fparent=form.parentNode;
  var where=form.nextSibling;
  xhr.onreadystatechange=function(){
    if (xhr.readyState==4){
      var leaders=d.createElement("div");leaders.className="leaderboard";leaders.innerHTML="";
      fparent.insertBefore(leaders,where);
      intf.fillleaderboard(leaders);
    }
  };
  xhr.send();
  d.gebi("restartbutton").focus();
  rm(form);
};

intf.fillleaderboard=function(obj){
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4){
      var sout="<div><div>Name</div><div>Score</div></div>";
      var ldata=JSON.parse(this.responseText);
      for (var i = 0; i < ldata.length; i++) {
        sout+="<div><div>"+ldata[i].name+"</div><div>"+ldata[i].score+"</div></div>";
      };
      obj.innerHTML=sout;
    }
  }
  xhr.open("GET","/game/leaders");
  xhr.send();
};


ael(window,"load",function(){
  if(window.location.host!="pontifo.herokuapp.com")
    intf.urprefix="http://pontifo.herokuapp.com";
  else
    intf.urprefix="";
  var hd=d.createElement("h2");
  hd.innerText="Pontifo!";
  intf.dloc=d.gebi("something");
  d.gebi("persistent").appendChild(hd);
  var scorer=d.createElement("div");
  scorer.id="scorer";
  d.gebi("persistent").appendChild(scorer);

  if(window.location.pathname=="/"){
    intf.titlescreen();}
  else if(window.location.pathname=="/leaderboard"){
    var leaders=d.createElement("div");leaders.className="leaderboard";leaders.innerHTML="";
    intf.dloc.appendChild(leaders);
    intf.fillleaderboard(leaders);
    var restart=d.createElement("input");
    ael(restart,"click",function(){
      history.pushState({"state":"newgame"},null,"/");
      intf.newgame();
      rm(restart);
    });
    restart.type="button";
    restart.value="New Game";
    intf.dloc.appendChild(restart);
    restart.focus();
  }
});
