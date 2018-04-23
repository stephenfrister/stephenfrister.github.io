
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


var ggName = ""
var ggId = 0



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
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
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

function getUserData(userId) {
    
    var userData = firebase.database().ref('/users/' + userId)
    userData.once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.val().cname) || '???';
        var userexp = (snapshot.val() && snapshot.val().exp) || '?';
        var userlvl = (snapshot.val() && snapshot.val().level) || '?';
        document.getElementById('id-userview-name').innerHTML = "Name: " + username;
        document.getElementById('id-userview-exp').innerHTML = "Exp: " + userexp;
        document.getElementById('id-userview-lvl').innerHTML = "Lvl<br>" + userlvl;
    });
    
    var userStats = firebase.database().ref('/users/' + userId + '/stats/')
    userStats.once('value').then(function(snapshot) {
        var userstr = (snapshot.val() && snapshot.val().str) || '?';
        var userdex = (snapshot.val() && snapshot.val().dex) || '?';
        var usercon = (snapshot.val() && snapshot.val().con) || '?';
        var userint = (snapshot.val() && snapshot.val().int) || '?';
        var userwis = (snapshot.val() && snapshot.val().wis) || '?';
        var usercha = (snapshot.val() && snapshot.val().cha) || '?';
        document.getElementById('id-userview-str').innerHTML = "Str<br>" + userstr;
        document.getElementById('id-userview-dex').innerHTML = "Dex<br>" + userdex;
        document.getElementById('id-userview-con').innerHTML = "Con<br>" + usercon;
        document.getElementById('id-userview-int').innerHTML = "Int<br>" + userint;
        document.getElementById('id-userview-wis').innerHTML = "Wis<br>" + userwis;
        document.getElementById('id-userview-cha').innerHTML = "Cha<br>" + usercha;
    });
    
    notesScrollListener()
    
}

function saveUserData(userId) {
    
    var userData = firebase.database().ref('/users/' + userId)
    var userStats = firebase.database().ref('/users/' + userId + '/stats/')
    
    var editable_elements = document.querySelectorAll("[contenteditable=true]");
    for(var i=0; i<editable_elements.length; i++)
        editable_elements[i].setAttribute("contenteditable", false);
    
    ////
    //  close form...
    ////
    
}

// move to bottom of actionClick
function userEdit(userId1, userId2)
{
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    
    getUserData(userId)
    
    ////
    //  display editable fields...
    ////
    
    document.getElementById("id-userview").classList.toggle("show");
    document.getElementById("id-description").classList.toggle("noshow");
    document.getElementById("id-userview-save").classList.remove("noshow");
    
    var editable_elements = document.querySelectorAll("[contenteditable=false]");
    for(var i=0; i<editable_elements.length; i++)
        editable_elements[i].setAttribute("contenteditable", true);
    
}

function userView(userId1, userId2)
{
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    
    getUserData(userId)
    
    document.getElementById("id-userview").classList.toggle("show");
    document.getElementById("id-description").classList.toggle("noshow");
    document.getElementById("id-userview-save").classList.add("noshow");
    
    checkArrowBottom()
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
        var btnNum = 0;
        
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
                else if(attribute.key == "race") {
                    rc[i] = attribute.val();
                }
                else if(attribute.key == "class") {
                    cls[i] = attribute.val();
                }
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
                html += "class='ff7 dropbtn' "
                html += "onclick='actionClick("
                html += userId1 + "," + userId2 + "," + btnNum
                // CHANGE "dropbtn" TO "dropbtn-disabled" TO DISABLE
                // COMMENT ABOVE TO DISABLE
                html += ")' >"
                html += "Action</button></td></td>"
                html += "</tr>"   
                html += "</tr>"
                
                btnNum++; 
            }
            i++;   
            
        });        
        html += "</table>"  
        obj.innerHTML = html
        settingsGet();
    });
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
            !openMenu.classList.contains('userview-close')  && 
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


function checkArrowBottom()
{
    //sh = document.getElementById("id-userview-description").scrollHeight;
    //st = document.getElementById("id-userview-description").scrollTop;
    //oh = document.getElementById("id-userview-description").offsetHeight; 
    //console.log("sh: " + sh + ", st: " + st + ", oh: " + oh)

    var obj = document.getElementById("id-userview-description"); 
    if( obj.scrollTop >= (obj.scrollHeight - obj.offsetHeight - 2))
    {
        document.getElementById("id-arrow-userinfo").classList.add("noshow");
    }
}
function setStoryScrollListener(){
    
    var stLast = -1;
    document.getElementById('id-story-div').addEventListener('scroll', function () {
        
        sh = document.getElementById("id-story-div").scrollHeight;
        st = document.getElementById("id-story-div").scrollTop;
        oh = document.getElementById("id-story-div").offsetHeight; 
        
        if( st == stLast ){
            document.getElementById("id-arrow-userinfo").classList.add("noshow");
        }
        else {
            stLast = st;
        }
        if ( sh - st < oh ) {
            document.getElementById("id-arrow").classList.add("noshow");
        }
    }, false);
}
function notesScrollListener(){
    
    document.getElementById("id-arrow-userinfo").classList.remove("noshow");
    document.getElementById('id-userview-description').addEventListener('scroll', function () {
        
        sh = document.getElementById("id-userview-description").scrollHeight;
        st = document.getElementById("id-userview-description").scrollTop;
        oh = document.getElementById("id-userview-description").offsetHeight; 
        
        if ( sh - st < oh ) {
            document.getElementById("id-arrow-userinfo").classList.add("noshow");
        }
    }, false);
}

// http://jsfiddle.net/0uwg96sh/
function scroll_down( divId ) {
    //console.log("divId: " + divId)
    var el = document.getElementById(divId);
    smooth_scroll_to(el, el.scrollTop + 200, 600);
}
var smooth_scroll_to = function(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return Promise.reject("bad duration");
    }
    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }
    var start_time = Date.now();
    var end_time = start_time + duration;
    var start_top = element.scrollTop;
    var distance = target - start_top;
    
    // based on http://en.wikipedia.org/wiki/Smoothstep
    var smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }
    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        var previous_top = element.scrollTop;

        // This is like a think function from a game loop
        var scroll_frame = function() {
            if(element.scrollTop != previous_top) {
                reject("interrupted");
                return;
            }
            // set the scrollTop for this frame
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            // check if we're done!
            if(now >= end_time) {
                resolve();
                return;
            }
            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if(element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollTop;

            // schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }
        // boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
    
}

function actionClick(userId1, userId2, btnId){
    
    var viewString = "onclick=userView(" + userId1 + "," + userId2 + ")"
    document.getElementById("actionmenuView").setAttribute("onclick", viewString);
    
    userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    
    // 101205953118627748108    // self
    // 108488361739358892865    // dm
    
    // current user matches ggId
    if( (userId == ggId) || (userId == 101205953118627748108) ){
        var editString = "onclick=userEdit(" + userId1 + "," + userId2 + ")"
        document.getElementById("actionmenuEdit").setAttribute("onclick", editString);
        document.getElementById("actionmenuEdit").style.color = "#eff1ff";
        document.getElementById("actionmenuEdit").classList.remove('disabled-hover');
    }
    else {
        var editString = " "
        document.getElementById("actionmenuEdit").setAttribute("onclick", editString);
        document.getElementById("actionmenuEdit").style.color = "#33334d";
        document.getElementById("actionmenuEdit").className = "disabled-hover";
    }
    
    document.getElementById("id-actionmenu").classList.add("show")
    document.getElementById("id-actionmenu").style.top = 40 * btnId + "px"
    
    //var expString = "onclick=claimExp(" + userId1 + "," + userId2 + ")"
    //document.getElementById("actionmenuExp").setAttribute("onclick", expString);
    //document.getElementById("actionmenuExp").style.color = "#33334d";
    //document.getElementById("actionmenuExp").className = "disabled-hover";
    
    //document.getElementById("id-actionmenu").innerHTML = "whatever";
    //document.getElementById("id-actionmenu").setAttribute("id", "div_top");
    
}	

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    
    var a = !event.target.matches('.dropbtn')
    var c = event.target.matches('.settings-close') 
    var d = event.target.classList.contains('setting-selection') 
    
    //var b = !event.target.matches('.clickarea-div') 
    //var e = event.target.matches('.userview-close') 
    
    //console.log(event.target);
    //console.log(event.target.id);
    
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
    //if ( c ) {
        //
    //}
    //if ( e ) {
        //console.log('userview-close: ' + ggId);
        //removeShow("userview-div"); 
        //settingsSave() 
    //}
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


function navClick(){
    document.getElementById("id-settings").classList.toggle("show");
    document.getElementById("id-description").classList.toggle("noshow");
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
function userviewClose() {
    removeShow("userview-div");
    removeNoShow("description-div");
}
function userviewSave() {
    
    ////
    //  save something...
    ////
    
    removeShow("userview-div");
    removeNoShow("description-div");
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
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
    ggName = googleUser.getBasicProfile().getName()
    ggId = googleUser.getBasicProfile().getId()
	var userMessage = document.getElementById("id-user-welcome");
    userMessage.innerHTML = "Welcome, " + ggName.split(" ")[0];
    //userMessage.innerHTML = "User: " + ggName + ", " + ggId;
}
function onFailure(error) {
	var userMessage = document.getElementById("id-user-welcome");
    userMessage.innerHTML = "Use Menu to Login > > > > > > > > > > > > > > > > > > > > > > > > > > > ";
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


