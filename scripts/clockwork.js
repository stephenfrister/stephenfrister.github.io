
var config = {
  apiKey: "AIzaSyClcH0NPVJJ5ToYDZd8nLbthBGlMNVjZ0M",
  authDomain: "python-clockwork-warriors.firebaseapp.com",
  databaseURL: "https://python-clockwork-warriors.firebaseio.com",
};

firebase.initializeApp(config);

var ping = firebase.database().ref('_ping');
var users = firebase.database().ref('users');
//var ghosts = firebase.database().ref('ghosts');

var chapters = firebase.database().ref('chapters');
var chapterAct = firebase.database().ref('chapters/active');
var chapterPart = firebase.database().ref('chapters/activepart');





function pingServer()
{
	ping.transaction(function (current_value) {
		return (current_value || 0) + 1; 
	});
}	

function getPing(divID)
{
	var obj = document.getElementById(divID);
		 
    ping.on("value", function(snapshot) {
        obj.innerHTML = snapshot.val();
    });

}

function claimExp(userId1, userId2)
{
    var userId = userId1.toString().concat( userId2.toString() );
    var exp = firebase.database().ref('users/' + userId + '/exp' );
    var hps = firebase.database().ref('users/' + userId + '/health' );
    
	hps.transaction(function (current_value) {
    
        if(current_value > 0) {
            exp.transaction(function (current_value) {
                return (current_value || 0) + 1; 
            });            
            return (current_value || 0) - 1;
        }        
        
	});
    
}	

function getStoryParts(divId1, divId2, divId3)
{
    var obj1 = document.getElementById(divId1);  
    var obj2 = document.getElementById(divId2); 
    var obj3 = document.getElementById(divId3); 
    
    var act = "0"
    var part = "0"
    var description = "..."
    
    chapters.on("value", function(snapshot) {

        chapterAct.once("value", function(snapshot) {
             act = snapshot.val();
        });

        chapterPart.once("value", function(snapshot) {
             part = snapshot.val();
        });
        
        obj1.innerHTML = "Act " + act + ": " + snapshot.child("/" + act + "/title").val();
        obj2.innerHTML = "Part " + part + ": " + snapshot.child("/" + act + "/" + part + "/title").val();
        obj3.innerHTML = snapshot.child("/" + act + "/" + part + "/description").val();
        
    });
    
}

function getUsers(divID)
{
	var obj = document.getElementById(divID);
    
    obj.innerHTML = "";
    
    var chars = new Array(); 
    var lvl = new Array();    
    var hps = new Array(); 
    var exp = new Array();  
    
    users.orderByValue().on("value", function(characters) {
    
        var i = 0;
        var html = "";
        var dropdowns = "";
        
        uid     = [];
        
        chars   = [];
        lvl     = []; 
        exp     = [];   
        hps     = [];  
        hmax    = []; 
        
        rc      = []; 
        cls     = [];
    
        html = "<table id='users-table'>"
        
        html += "<tr class='ff7-header'>"
        html += "<td style='width:150px'>Name</td>"
        html += "<td style='width:100px' align='center'>Lvl</td>"
        html += "<td style='width:150px'>Race</td>"
        html += "<td style='width:100px'>Class</td>"
        html += "<td style='width:50px'> </td>"
        html += "</tr>"
        
        //html += "<td style='width:150px' align='center'>Race</td>"
        //html += "<td style='width:100px' align='center'>Class</td>"
        //html += "<td style='width:150px' align='center'>Energy</td>"
        //html += "<td style='width:100px' align='center'>Exp</td>"
        
        characters.forEach(function(userid) {
                
            userid.forEach(function(attribute) {
                
                uid[i] = userid.key
                
                if(attribute.key == "cname") {
                    chars[i] = attribute.val();
                    //chars[i] = userid.key
                }
                if(attribute.key == "exp") {
                    exp[i] = attribute.val();
                }
                else if(attribute.key == "health") {
                    hps[i] = attribute.val();
                }
                else if(attribute.key == "healthmax") {
                    hmax[i] = attribute.val();
                }
                else if(attribute.key == "level") {
                    lvl[i] = attribute.val();
                }
                
                
                
                // TODO: 
                
                else if(attribute.key == "race") {
                    rc[i] = attribute.val();
                }
                else if(attribute.key == "class") {
                    cls[i] = attribute.val();
                }
                
                // END
                
                
                
                else if( attribute.key == "power" || attribute.key == "magic" ) {
                    // empty for now
                }
                else {
                    // empty ? 
                }
                
            });
            
            if( (typeof chars[i] != 'undefined') && (uid[i] != 108488361739358892865) ) {
                
                html += "<tr>"
                
                if(typeof lvl[i] == 'undefined'){
                    lvl[i] = "?"
                }            
                if(typeof hps[i] == 'undefined'){
                    hps[i] = "?"
                }             
                if(typeof hmax[i] == 'undefined'){
                    hmax[i] = "?"
                }           
                if(typeof exp[i] == 'undefined'){
                    exp[i] = "?"
                }            
                if(typeof rc[i] == 'undefined'){
                    rc[i] = "???"
                }      
                if(typeof cls[i] == 'undefined'){
                    cls[i] = "???"
                }             
                
                html += "<td>"
                html += chars[i].split(":")[0]
                //html += uid[i]
                html += "</td>"
                
                //html += "<td>"
                html += "<td align='center'>"
                html += lvl[i]
                html += "</td>"
                
                html += "<td>"
                //html += "<td align='center'>"
                html += rc[i]
                html += "</td>"
                
                html += "<td>"
                //html += "<td align='center'>"
                html += cls[i]
                html += "</td>"
                
                //html += "<td align='center'>"
                //html += hps[i] + " / " + hmax[i]
                //html += "</td>"
                
                //html += "<td align='center'>"
                //html += exp[i]
                //html += "</td>"  
                
                var userId = userid.key
                
                userId1 = userId.slice(0,10)
                userId2 = userId.slice(10,userId.length)
                
                html += "<td align='center'>"
                html += "<button "
                html += "type='action-button' "
                html += "class='ff7 dropbtn-disabled' "
                // CURRENTLY DISABLED, CHANGE dropbtn-disabled TO dropbtn TO ENABLE
                //html += "onclick='actionClick("
                //html += userId1 + "," + userId2
                // UNCOMMENT ABOVE TO ENABLE
                html += ")' >"
                html += "Action</button></td></td>"
                
                html += "</tr>"   
                
                html += "</tr>"
            }
            i++;   
            
        });        
        html += "</table>"  
        obj.innerHTML = html
        settingsGet();
    });
}

function scrollDiv(){
    document.getElementById("story-div").scrollTop += 200;
}

function actionClick(userId1, userId2){
    
    //var expString = "onclick=claimExp(" + userId1 + "," + userId2 + ")"
    
    //document.getElementById("actionmenuAttack").setAttribute("onclick", mString);
    //document.getElementById("actionmenuMagic").setAttribute("onclick", mString);
    //document.getElementById("actionmenuItem").setAttribute("onclick", mString);
    //document.getElementById("actionmenuExp").setAttribute("onclick", expString);
    
    document.getElementById("id-actionmenu").classList.toggle("show");
    
    document.getElementById("actionmenuAttack").style.color = "#33334d";
    document.getElementById("actionmenuMagic").style.color = "#33334d";
    document.getElementById("actionmenuItem").style.color = "#33334d";
    document.getElementById("actionmenuExp").style.color = "#33334d";
    
    document.getElementById("actionmenuAttack").className = "disabled-hover";
    document.getElementById("actionmenuMagic").className = "disabled-hover";
    document.getElementById("actionmenuItem").className = "disabled-hover";
    document.getElementById("actionmenuExp").className = "disabled-hover";
    
    //document.getElementById("id-actionmenu").innerHTML = "whatever";
    //document.getElementById("id-actionmenu").setAttribute("id", "div_top");
    
}	

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    
    var a = !event.target.matches('.dropbtn')
    var c = event.target.matches('.settings-close') 
    var d = event.target.classList.contains('setting-selection') 
    
    //var b = !event.target.matches('.clickarea-div') 
    
    //console.log(event.target);
    //console.log(event.target.id);
    
    //console.log("d: " + d);
    //console.log("c: " + c);
    //console.log("b: " + b);
    //console.log("a: " + a);
    
    if ( a ) {
        removeShow("actionmenu-content"); 
    }
    
    if ( c ) {
        removeShow("settings-div"); 
        settingsSave() 
    }
    
    if ( d ) {
        var themeID = event.target.id;
        setTheme(themeID);
        setCookie('theme',themeID,365);
        if (themeID == 'ff7-0') {
            deleteCookie('theme')
        }
        
    }
  
}

function navClick(){

    // ELEMENT ID
    document.getElementById("id-settings").classList.toggle("show");
    document.getElementById("id-description").classList.toggle("noshow");
   
    //document.getElementById("id-settings-header").classList.toggle("show");
    //document.getElementById("id-settings-content").classList.toggle("show");
    
}

function removeShow(className) {
    var mClass = document.getElementsByClassName(className);
    var i;
    for (i = 0; i < mClass.length; i++) {
        var openClass = mClass[i];
        if (openClass.classList.contains('show')) {
            openClass.classList.remove('show');
        }
    }
    
}
function removeNoShow(className) {
    var mClass = document.getElementsByClassName(className);
    var i;
    for (i = 0; i < mClass.length; i++) {
        var openClass = mClass[i];
        if (openClass.classList.contains('noshow')) {
            openClass.classList.remove('noshow');
        }
    }
    
}

function settingsGet() {
    var mTheme = getCookie('theme')
    setTheme(mTheme)
}
function settingsSave() {
    var mTheme = getCookie('theme')
    setCookie( 'theme-saved', mTheme, 365 )
    removeShow("settings-div");
    removeNoShow("description-div");
}
function settingsCancel() {
    var mThemeOld = getCookie('theme-saved')
    setTheme(mThemeOld)
    removeShow("settings-div");
    removeNoShow("description-div");
}

function setTheme(themeID){

// ELEMENT CLASS
    var menus = document.getElementsByClassName("ff7");
    var i;
    
    if(!themeID){
        themeID = "ff7-0"
    }
        
    for (i = 0; i < menus.length; i++) {
        var openMenu = menus[i];
        if ( openMenu.classList.contains('ff7') && 
            !openMenu.classList.contains('setting-selection') && 
            !openMenu.classList.contains('settings-close')  && 
            !openMenu.classList.contains('title-user') 
            ) {
            
            openMenu.classList.remove('ff7-0')
            openMenu.classList.remove('ff7-2')
            openMenu.classList.remove('ff7-3')
            openMenu.classList.remove('ff7-4')
            openMenu.classList.remove('ff7-5')
            openMenu.classList.remove('ff7-6')
            openMenu.classList.remove('ff7-7')
            openMenu.classList.remove('ff7-8')
            openMenu.classList.remove('ff7-9')
            openMenu.classList.remove('ff7-10')
            
            openMenu.classList.add(themeID);
        }
    }
    
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        //date.setTime(date.getTime() + (years*365*24*60*60*1000));
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function deleteCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}


function onSuccess(googleUser) {
    mName = googleUser.getBasicProfile().getName()
    mId = googleUser.getBasicProfile().getId()
    //console.log('getName: ' + mName);
    //console.log('getId: ' + mId);
    
	var userMessage = document.getElementById("id-user-welcome");
    userMessage.innerHTML = "User: " + mName + ", " + mId;
    //userMessage.innerHTML = "Welcome, " + mName + " : " + mId;
    
}
function onFailure(error) {
    //console.log(error);
    
	var userMessage = document.getElementById("id-user-welcome");
    userMessage.innerHTML = "";
    
}
function renderButton() {
    gapi.signin2.render('id-gSign', {
        'scope': 'profile email',
        'width': 30,
        'height': 30,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}


