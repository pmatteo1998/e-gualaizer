var toggle=[document.getElementById("target"),document.getElementById("scrivi")]

var peer = new Peer(); 
var id_ ="";
let gg = /gg{[^}]+}gg/g; 
let dg = /dg{[^}]+}dg/g; 
var prev_dg_arr=[];
var prev_gg_arr=[];
var viz = new Viz();
var viz2 = new Viz();
var not_send =false;
var hash="";
var conn;
function scrivi(){
    toggle[0].style.display="none";
    toggle[1].style.display="block";
}
function visualizza(){
    toggle[1].style.display="none";
    toggle[0].style.display="block";
}
function rander_page(txt){
    var  gg_arr=txt.match(gg);
    if(gg_arr)
    gg_arr.forEach((element,i) => {
       txt= txt.replace(element,"<div id='gg"+i+"'></div>");
    });
    var  dg_arr=txt.match(dg);
    if(dg_arr)
    dg_arr.forEach((element,i) => {
       txt= txt.replace(element,"<div id='dg"+i+"'></div>");
    });
    console.log(txt)
    toggle[0].innerHTML=marked(txt);
    MathJax.typeset()
    if(dg_arr != null && dg_arr!=prev_dg_arr){
    prev_dg_arr=dg_arr;
    dg_arr.forEach((element,i) => {
        element=element.replace(/(}|)dg({|)/g,"");
        viz.renderSVGElement('digraph {'+element+'}')
        .then(function(element) {
            document.getElementById("dg"+i).appendChild(element);
            not_send=false;
        }).catch(a=>{
            console.log("Not Me. Us.");
            viz = new Viz();    
            not_send=true;
    
        }
        )
    });}

    if(gg_arr != null&&gg_arr!=prev_gg_arr){
        prev_gg_arr=gg_arr;
    gg_arr.forEach((element,i) => {
        element=element.replace(/(}|)gg({|)/g,"");
        viz2.renderSVGElement('graph {'+element+'}')
        .then(function(element) {
            document.getElementById("gg"+i).appendChild(element);
            not_send=false;
        }).catch(a=>{
            console.log("Not Me. Us.");
            viz2 = new Viz();    
            not_send=true;
        }
        )
    });
    }
}

function render_send(){
var txt=toggle[1].value;
rander_page(txt);
conn.send(toggle[1].value);
}

async function copyPageUrl(a) {
    try {
      await navigator.clipboard.writeText(a);
      console.log('Page URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }

  }
function copylink(){
    copyPageUrl(location.protocol + '//' + location.host + location.pathname+"#"+id)
    document.getElementById("link").innerHTML="link copiato";
    setInterval(function (){document.getElementById("link").innerHTML="copia link";}, 1000)
}

function propagate(data){
    console.log(data);
    rander_page(data);
    toggle[1].value=data;
}
function unlock(id_){
    id=id_;
    document.getElementById("link").innerHTML="copia link";
    document.getElementById("link").onclick=copylink;
peer.on('connection', function(conn_) {
  conn=conn_;
  conn.on('data',propagate);
       document.getElementById("link").style.display="none";
document.getElementById("on").style.display="flex";});
  //  setInterval(check_connection,100);
}

if(window.location.hash) {
  hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
  peer.on('open', function(id) {
   conn= peer.connect(hash);
   document.getElementById("link").style.display="none";
   document.getElementById("on").style.display="flex";

   conn.on('data',propagate);
  });
} else {
 peer.on('open', function(id) {
        unlock(id)        
      });
}
 

