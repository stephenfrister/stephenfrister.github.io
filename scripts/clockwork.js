
var config = {
  apiKey: "AIzaSyClcH0NPVJJ5ToYDZd8nLbthBGlMNVjZ0M",
  authDomain: "python-clockwork-warriors.firebaseapp.com",
  databaseURL: "https://python-clockwork-warriors.firebaseio.com",
};

firebase.initializeApp(config);

var users = firebase.database().ref('users');
var chapters = firebase.database().ref('chapters');
var chapterAct = firebase.database().ref('chapters/active');
var chapterPart = firebase.database().ref('chapters/activepart');

var ggName = "";
var ggId = 0;

var notesListener = false; 

function getUserData(userId) {
    
    var userData = firebase.database().ref('/users/' + userId)
    userData.once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.child('cname').val()) || '???';
        var userrace = (snapshot.val() && snapshot.child('race').val()) || '?';
        var userlvl = (snapshot.val() && snapshot.child('level').val()) || '?';
        var userexp = (snapshot.val() && snapshot.child('exp').val()) || '?';
        var userclass = (snapshot.val() && snapshot.child('class').val()) || '?';
        var userother = (snapshot.val() && snapshot.child('other').val()) || '?';
        document.getElementById('id-userview-name').innerHTML = username;
        document.getElementById('id-userview-exp').innerHTML = userexp;
        document.getElementById('id-userview-lvl').innerHTML = userlvl;
        document.getElementById('id-userview-race').innerHTML = userrace;
        document.getElementById('id-userview-class').innerHTML = userclass;
        document.getElementById('id-userview-other').innerHTML = userother;
    });
    
    var userStats = firebase.database().ref('/users/' + userId + '/stats/')
    userStats.once('value').then(function(snapshot) {
        var userstr = (snapshot.val() && snapshot.child('str').val()) || '?';
        var userdex = (snapshot.val() && snapshot.child('dex').val()) || '?';
        var usercon = (snapshot.val() && snapshot.child('con').val()) || '?';
        var userint = (snapshot.val() && snapshot.child('int').val()) || '?';
        var userwis = (snapshot.val() && snapshot.child('wis').val()) || '?';
        var usercha = (snapshot.val() && snapshot.child('cha').val()) || '?';
        document.getElementById('id-userview-str').innerHTML = userstr;
        document.getElementById('id-userview-dex').innerHTML = userdex;
        document.getElementById('id-userview-con').innerHTML = usercon;
        document.getElementById('id-userview-int').innerHTML = userint;
        document.getElementById('id-userview-wis').innerHTML = userwis;
        document.getElementById('id-userview-cha').innerHTML = usercha;
    });
    
    // get current notes
    var notesAct = document.getElementById('id-userview-notes-act').innerHTML;
    var userNotes = firebase.database().ref('/users/' + userId + '/notes/' + notesAct + '/')
    userNotes.once('value').then(function(snapshot) {
        var notes = snapshot.val() || '???';
        document.getElementById('id-userview-notes').innerHTML = notes;
        checkArrowBottom();
        notesScrollListener();
    });
}
    
function saveUserData(userId1, userId2) {
    
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    var userData = firebase.database().ref('/users/' + userId);
        
    var username = document.getElementById('id-userview-name').innerHTML.replace(/\W/g, '');
    var userrace = document.getElementById('id-userview-race').innerHTML.replace(/\W/g, ' ');   // allow spaces
    var userclass = document.getElementById('id-userview-class').innerHTML.replace(/\W/g, '');
    var userother = document.getElementById('id-userview-other').innerHTML.replace(/\W/g, '');
    var userexp = document.getElementById('id-userview-exp').innerHTML.replace(/\W/g, '');
    var userlvl = document.getElementById('id-userview-lvl').innerHTML.replace(/\W/g, '');
    var userstr = document.getElementById('id-userview-str').innerHTML.replace(/\W/g, '');
    var userdex = document.getElementById('id-userview-dex').innerHTML.replace(/\W/g, '');
    var usercon = document.getElementById('id-userview-con').innerHTML.replace(/\W/g, '');
    var userint = document.getElementById('id-userview-int').innerHTML.replace(/\W/g, '');
    var userwis = document.getElementById('id-userview-wis').innerHTML.replace(/\W/g, '');
    var usercha = document.getElementById('id-userview-cha').innerHTML.replace(/\W/g, '');
    
    var userNotes = document.getElementById('id-userview-notes').innerHTML;
    var notesAct  = document.getElementById('id-userview-notes-act').innerHTML;
    var notesPath = '/notes/' + notesAct;
    
    username  = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
    //userrace  = userrace.charAt(0).toUpperCase() + userrace.slice(1).toLowerCase();   // allow mutiple words
    userclass = userclass.charAt(0).toUpperCase() + userclass.slice(1).toLowerCase();
    
    // update user data
    userData.update({
        '/cname'    : username,
        '/exp'      : userexp,
        '/level'    : userlvl,
        '/race'     : userrace,
        '/class'    : userclass,
        '/other'    : userother,
        '/stats/str'    : userstr,
        '/stats/dex'    : userdex,
        '/stats/con'    : usercon,
        '/stats/int'    : userint,
        '/stats/wis'    : userwis,
        '/stats/cha'    : usercha,
        [notesPath]     : userNotes
        
    })
    .catch(function (err) {
        console.log("save failed: ", err);
    });
    
    // close form
    userviewClose();
}

function userviewSelect() { 
    
    // show the notes-menu
    document.getElementById("id-notes-menu").classList.toggle("show")

    // get act list
    var chapters = firebase.database().ref('/chapters/')
    chapters.once('value').then(function(snapshot) {
        
        var count = (snapshot.val() && snapshot.child('count').val()) || '0';
        var notesMenu = document.getElementById("id-notes-menu")
        
        notesMenu.innerHTML = "";
        notesMenu.innerHTML += "<a href='#' onclick='changeActNotes(0,0)' id='' >Character Story</a>";
        notesMenu.innerHTML += "<a href='#' onclick='changeActNotes(0,1)' id='' >Miscellaneous</a>";
        
        // ignore 0,0 and 0,1
        // reverse order
        // the most recent is at the top (#3) of the list
        var titles = []
        for( var i = count ; i > 0 ; i-- ) {
            var partsPath = i + "/parts" 
            var partsValue = (snapshot.val() && snapshot.child(partsPath).val()) || '?'; 
            for( var j = partsValue ; j >= 1 ; j-- ) { 
                var titlePath = i + "/" + j + "/title" 
                var titleValue = (snapshot.val() && snapshot.child(titlePath).val()) || '?'; 
                var actpart = i + "," + j
                var clickChange = 'onclick=changeActNotes(' + actpart + ')'
                actList = '<a href="#" onclick="' + clickChange + '" >' + i + "," + j + ": " + titleValue + '</a>';
                notesMenu.innerHTML += actList;
            }
        }
    });
}
function saveActNotes(){
    
    // save current before moving to next...
    var userId = document.getElementById('id-userview-notes-id').innerHTML;
    var userNotes = document.getElementById('id-userview-notes').innerHTML;
    var notesAct  = document.getElementById('id-userview-notes-act').innerHTML;
    var notesPath = '/notes/' + notesAct;
    
    // update user data
    var oldsNotes = firebase.database().ref('/users/' + userId);
    oldsNotes.update({
        [notesPath] : userNotes
    })
    .catch(function (err) {
        console.log("save failed: ", err);
    });
    
}

function changeActNotes( act, part ){
    
    saveActNotes();
    
    // get notes from the act selected from the dropdown
    var actpart = act + "," + part
    document.getElementById('id-userview-notes-act').innerHTML = actpart;
    
    var actTitle = firebase.database().ref('/chapters/' + act + '/' + part + '/title')
    actTitle.once('value').then(function(snapshot) {
        var notesTitle = snapshot.val() || '...';
        if( act == 0 ) {
            if( part == 0 ){
                notesTitle = "Character Story: ";
            }
            if( part == 1 ){
                notesTitle = "Miscellaneous: ";
            }
        }
        else {
            notesTitle = "Act: " + act + ", Part: " + part + ": " + notesTitle; 
        }
        document.getElementById('id-userview-notes-title').innerHTML = notesTitle ;
    });
    
    var userData = firebase.database().ref('/users/' + userId + '/notes/' + actpart)
    userData.once('value').then(function(snapshot) {
        var actnotes = snapshot.val() || '...';
        document.getElementById('id-userview-notes').innerHTML = actnotes ;
    });
    
    document.getElementById("id-notes-menu").classList.toggle("show");
    
    
    document.getElementById("id-userview-description").scrollTop = 0;
    document.getElementById("id-arrow-userinfo").classList.remove("noshow");
    
}

function userviewClose() { 
    var editable_elements = document.querySelectorAll("[contenteditable=true]");
    for( var i = 0 ; i < editable_elements.length ; i++ ) {
        editable_elements[i].classList.remove("editable");
        editable_elements[i].setAttribute("contenteditable", false);
    }   
    removeShow("userview-div");
    removeNoShow("description-div");  
    document.getElementById("id-notes-menu").classList.remove("show");   
    document.getElementById("id-story-div").classList.toggle("noshow");    
    saveActNotes();
}

function userView(userId1, userId2)
{
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    getUserData(userId);
    
    document.getElementById('id-userview-notes-id').innerHTML = userId;
    
    document.getElementById("id-userview").classList.toggle("show");
    
    document.getElementById("id-story-div").classList.toggle("noshow");
    document.getElementById("id-description").classList.toggle("noshow");
    document.getElementById("id-userview-save").classList.add("noshow");
}

function userEdit(userId1, userId2)
{
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    getUserData(userId);
    
    document.getElementById('id-userview-notes-id').innerHTML = userId;
    
    document.getElementById("id-userview-save").setAttribute( 'onclick','saveUserData(' + userId1 + ',' + userId2 + ')' );
    
    document.getElementById("id-userview").classList.toggle("show");
    
    document.getElementById("id-story-div").classList.toggle("noshow");
    document.getElementById("id-description").classList.toggle("noshow");
    document.getElementById("id-userview-save").classList.remove("noshow");
    
    var editable_elements = document.querySelectorAll("[contenteditable=false]");
    for(var i=0; i<editable_elements.length; i++) {
        editable_elements[i].setAttribute("contenteditable", true);
        editable_elements[i].classList.add("editable");
    }    
}

function actionClick(userId1, userId2, btnId){
    
    var viewString = "onclick=userView(" + userId1 + "," + userId2 + ")"
    document.getElementById("actionmenuView").setAttribute("onclick", viewString);
    
    userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    
    // 110094113716589359072    // self1
    // 108360043117969116770    // self2
    // 108488361739358892865    // dm
    
    //console.log("ggId: " + ggId);
    //console.log("userId: " + userId);
    
    // current user matches ggId
    if( (userId == ggId) || (ggId == 110094113716589359072) || (ggId == 108488361739358892865) ){
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
}	

function storySelectClick() {
    
    // get act list
    // populate selection menu
    var chapters = firebase.database().ref('/chapters/')
    chapters.once('value').then(function(snapshot) {
        
        var count = (snapshot.val() && snapshot.child('count').val()) || '0';
        var storyMenu = document.getElementById("id-story-menu")
        storyMenu.innerHTML = "";
        
        var titles = []
        for( var i = 0 ; i < count ; i++ ) {
            
            var partsPath = i + "/parts" 
            var partsValue = (snapshot.val() && snapshot.child(partsPath).val()) || '?'; 
            
            for( var j = 0 ; j <= partsValue ; j++ ) { 
            
                // part 0 does not exist
                // 0,0 is a special case
                if ( !(j == 0 && i > 0) ){
                    
                    var actTitlePath = i + "/title" 
                    var actTitle = (snapshot.val() && snapshot.child(actTitlePath).val()) || '?'; 
                    var partTitlePath = i + "/" + j + "/title" 
                    var partTitle = (snapshot.val() && snapshot.child(partTitlePath).val()) || '?'; 
                    var actpart = i + "," + j
                    var clickChange = 'onclick=storyChange(' + actpart + ')'
                    var displayActPart = "Act " + i + ": " + actTitle + ", Part " + j + ": " + partTitle;
                    
                    storyList = '<a href="#" onclick="' + clickChange + '" >' + displayActPart + '</a>';
                    storyMenu.innerHTML += storyList;
                }
            }
        }
        
    });
    
    // show selection menu
    document.getElementById("id-story-menu").classList.add("show")
    
}

function storyChange( act, part ) {
    // change displayed story
    changeStoryParts( "id-ctitle-div", "id-ptitle-div", "id-description", act, part );
    document.getElementById("id-story-div").scrollTop = 0;
    document.getElementById("id-arrow").classList.remove("noshow");
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

function changeStoryParts(divId1, divId2, divId3, act, part)
{
    var obj1 = document.getElementById(divId1);  
    var obj2 = document.getElementById(divId2); 
    var obj3 = document.getElementById(divId3); 
    
    chapters.once("value", function(snapshot) {
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
    var obj = document.getElementById("id-userview-description"); 
    if( obj.scrollTop >= (obj.scrollHeight - obj.offsetHeight - 2))
    {
        document.getElementById("id-arrow-userinfo").classList.add("noshow");
    }
}
function checkStoryArrowBottom()
{
    var obj = document.getElementById("id-story-div"); 
    if( obj.scrollTop >= (obj.scrollHeight - obj.offsetHeight - 2))
    {
        document.getElementById("id-arrow").classList.add("noshow");
    }
}
function notesScrollListener(){
    
    document.getElementById("id-arrow-userinfo").classList.remove("noshow");
    
    if(!notesListener){
        document.getElementById('id-userview-description').addEventListener('scroll', function () {
            
            sh = document.getElementById("id-userview-description").scrollHeight;
            st = document.getElementById("id-userview-description").scrollTop;
            oh = document.getElementById("id-userview-description").offsetHeight; 
            
            if ( sh - st < oh ) {
                document.getElementById("id-arrow-userinfo").classList.add("noshow");
            }
        }, false);
        notesListener = true;
    }
}
function setStoryScrollListener(){
    
    var stLast = -1;
    document.getElementById('id-story-div').addEventListener('scroll', function () {
        sh = document.getElementById("id-story-div").scrollHeight;
        st = document.getElementById("id-story-div").scrollTop;
        oh = document.getElementById("id-story-div").offsetHeight; 
        if( st == stLast ){
            document.getElementById("id-arrow").classList.add("noshow");
        }
        else {
            stLast = st;
        }
        if ( sh - st <= oh ) {
            document.getElementById("id-arrow").classList.add("noshow");
        }
    }, false);
}

// http://jsfiddle.net/0uwg96sh/
function scroll_down( divId ) {
    //console.log("divId: " + divId)
    var el = document.getElementById(divId);
    smooth_scroll_to(el, el.scrollTop + 200, 600);
    checkArrowBottom();
    checkStoryArrowBottom();
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
	var userMessage = document.getElementById("id-gguser-welcome");
    userMessage.innerHTML = "Welcome, " + ggName.split(" ")[0];
    //userMessage.innerHTML = "User: " + ggName + ", " + ggId;
}
function onFailure(error) {
	var userMessage = document.getElementById("id-gguser-welcome");
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

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    
    var a = !event.target.matches('.dropbtn');
    var c = event.target.matches('.settings-close');
    var d = event.target.classList.contains('setting-selection');
    var f = !event.target.classList.contains('ctitle-div');
    var g = !event.target.classList.contains('ptitle-div');
    
    //var b = !event.target.matches('.clickarea-div');
    //var e = event.target.matches('.userview-close');
    
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
    if ( f && g ) {
        removeShow("story-menu-content"); 
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

document.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
    
    console.log(document.activeElement.id)
    
    if( document.activeElement.id != "id-userview-notes" )
    {
        if( e.keyCode == 13 ) {
            e.preventDefault()
        }
    }
    if( document.activeElement.className.split(" ").indexOf("numOnly") > -1 )
    {
        if( (e.keyCode >= 65) && (e.keyCode <= 90) ){
            e.preventDefault()
        }
        
    }
    if( document.activeElement.className.split(" ").indexOf("noNum") > -1 )
    {
        if( (e.keyCode >= 48) && (e.keyCode <= 57) ){
            e.preventDefault()
        }
        
    }
}



/*
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
*/