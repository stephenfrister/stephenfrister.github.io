
var config = {
  apiKey: "AIzaSyClcH0NPVJJ5ToYDZd8nLbthBGlMNVjZ0M",
  authDomain: "python-clockwork-warriors.firebaseapp.com",
  databaseURL: "https://python-clockwork-warriors.firebaseio.com",
};

firebase.initializeApp(config);

var users = firebase.database().ref('users');
var quests = firebase.database().ref('quests');
var chapters = firebase.database().ref('chapters');
var chapterAct = firebase.database().ref('chapters/active');
var chapterPart = firebase.database().ref('chapters/activepart');

var ggId = 0;
var ggName = "";

var globalQuestId = 0;
var globalQuestInfoId = 0;
var globalQuestOldStatus = ""

var isQuestEdit = false;
var notesListener = false; 



$( document ).ready( function () 
{
    $( "#id-maps-div-img" ).draggable({
        handle: "img",
        containment : [ -700, -700, 0, 100 ]
    });
        //containment : [ x-right, y-down, x-left, y-up ]
        
        //containment : [ -600, -600, 200, 200 ]
        //containment : [ -600, -600, 200, 200 ]
        //containment : "parent"
        //containment : "document"
        //containment : "window"
        //scroll: false 
    
    var url_string = window.location.href;
    var url = new URL(url_string);

    var pMap = url.searchParams.get("map");
    var pQuests = url.searchParams.get("quests");
    var pTop = url.searchParams.get("top");
    var pMiddle = url.searchParams.get("middle");


    /*
    http://127.0.0.1:4000/clockwork.html
    http://127.0.0.1:4000/clockwork.html?map=1
    http://127.0.0.1:4000/clockwork.html?quests=1
    http://127.0.0.1:4000/clockwork.html?top=0
    http://127.0.0.1:4000/clockwork.html?middle=0
    */
    
    // need to add to url
    // and ALSO remove

    console.log(pTop);
    console.log(pMiddle);
    
    detectUrlState();
    
    /*
    if( pMap == "1" ){
        mapsClick();
    }
    if( pQuests == "1" ){
        questsClick();
    }
    */
    
    if( pTop == "1" ){
        console.log("close top...");
    
    }
    if( pMiddle == "1" ){
        console.log("close middle...");
        
    }

});


//$( document ).ready( function() 
jQuery( document ).ready(function( $ ) {

    $(window).on('popstate', function() {
        detectUrlState();
    });
    
});

function mapZoomIn() {
    console.log("zoom in...");
    
    //var myMap = document.getElementById("id-maps-img");
    //var mapTop = myMap.clientWidth;
    //var mapLeft = myMap.clientWidth;
    //var mapWidth = myMap.clientWidth;
    
    //var x = Math.abs( myMap.position().left ) + myMap.width() / 2
    //var y = Math.abs( myMap.position().top ) + myMap.height() / 2
    
    //myMap.style.top = (mapTop * 1.2) + "px";
    //myMap.style.left = (mapLeft * 1.2) + "px";
    //myMap.style.width = (mapWidth * 1.2) + "px";
    
}

function mapZoomOut(){
    console.log("zoom out...");
    
    //var myMap = document.getElementById("id-maps-img");
    //var mapTop = myMap.clientWidth;
    //var mapLeft = myMap.clientWidth;
    //var mapWidth = myMap.clientWidth;
    
    //myMap.style.top = (mapTop * 0.8) + "px";
    //myMap.style.left = (mapLeft * 0.8) + "px";
    //myMap.style.width = (mapWidth * 0.8) + "px";
    
}

function detectUrlState() 
{
    var url_string = window.location.href;
    var url = new URL(url_string);

    var pMap = url.searchParams.get("map");
    var pQuests = url.searchParams.get("quests");


    if( pMap == "1" ){
        mapsClick();
    }
    if( pQuests == "1" ){
        questsClick();
    }
    if( !pMap=="1" && !pQuests=="1" ){
        charsClick();
    }
}


function addParam(url, param, value) 
{
    
    var base_url = window.location.origin;
    url = base_url + "/clockwork.html"; 
    //var host = window.location.host;
    //var pathArray = window.location.pathname.split( '/' );
    
    var a = document.createElement('a'), regex = /(?:\?|&amp;|&)+([^=]+)(?:=([^&]*))*/g;
    var match, str = []; a.href = url; param = encodeURIComponent(param);
    
    while (match = regex.exec(a.search))
       if (param != match[1]) str.push(match[1]+(match[2]?"="+match[2]:""));
    str.push(param+(value?"="+ encodeURIComponent(value):""));
    a.search = str.join("&");
    
    return a.href;
}

function positionMap()
{
	var oMap = document.getElementById("id-maps-div-img");
    oMap.style.top = "-580px";
    oMap.style.left = "-720px";
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
                
                var userId = userid.key
                
                userId1 = userId.slice(0,10)
                userId2 = userId.slice(10,userId.length)
                
                html += "<td align='center'>"
                html += "<button "
                html += "type='action-button' "
                html += "class='ff7 dropbtn' "                      // CHANGE "dropbtn" TO "dropbtn-disabled" TO DISABLE
                html += "onclick='actionClick("
                html += userId1 + "," + userId2 + "," + btnNum      // COMMENT TO DISABLE
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








///
///     USER FUNCTIONS
///

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

function userEdit(userId1, userId2)
{
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    getUserData(userId);
    
    document.getElementById('id-userview-notes-id').innerHTML = userId;
    
    document.getElementById("id-userview-save").setAttribute( 'onclick','saveUserData(' + userId1 + ',' + userId2 + ')' );
    
    document.getElementById("id-userview").classList.toggle("show");
    
    document.getElementById("id-title-div").classList.toggle("noshow");
    document.getElementById("id-story-div").classList.toggle("noshow");
    
    document.getElementById("id-description").classList.toggle("noshow");
    document.getElementById("id-userview-save").classList.remove("noshow");
    
    var editable_elements = document.querySelectorAll("[contenteditable=false]");
    for(var i=0; i<editable_elements.length; i++) {
        editable_elements[i].setAttribute("contenteditable", true);
        editable_elements[i].classList.add("editable");
    }    
}

function userviewClose() { 
    var editable_elements = document.querySelectorAll("[contenteditable=true]");
    for( var i = 0 ; i < editable_elements.length ; i++ ) {
        
        var ee1 = editable_elements[i].id === "id-title-edit"; 
        var ee2 = editable_elements[i].id === "id-description-edit"; 
        
        if ( !ee1 && !ee2 ) {
            editable_elements[i].classList.remove("editable");
            editable_elements[i].setAttribute("contenteditable", false);
        }
    }   
    removeShow("userview-div");
    removeNoShow("description-div");  
    document.getElementById("id-notes-menu").classList.remove("show"); 
    
    document.getElementById("id-title-div").classList.toggle("noshow");
    document.getElementById("id-story-div").classList.toggle("noshow");  
    
    saveActNotes();
}

function userView(userId1, userId2)
{
    var userId = userId1.toString().concat( userId2.toString().padStart(11,"0") );
    getUserData(userId);
    
    document.getElementById('id-userview-notes-id').innerHTML = userId;
    
    document.getElementById("id-userview").classList.toggle("show");
    
    document.getElementById("id-title-div").classList.toggle("noshow");
    document.getElementById("id-story-div").classList.toggle("noshow");  
    
    document.getElementById("id-description").classList.toggle("noshow");
    document.getElementById("id-userview-save").classList.add("noshow");  
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

function getUserData(userId) {
    
    var userData = firebase.database().ref('/users/' + userId)
    userData.once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.child('cname').val()) || '???';
        var userrace = (snapshot.val() && snapshot.child('race').val()) || '?';
        var userlvl = (snapshot.val() && snapshot.child('level').val()) || '?';
        var userexp = (snapshot.val() && snapshot.child('exp').val()) || '?';
        var userclass = (snapshot.val() && snapshot.child('class').val()) || '?';
        var userother = (snapshot.val() && snapshot.child('other').val()) || '?';
        document.getElementById('id-userview-name').innerHTML = username.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-exp').innerHTML = userexp.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-lvl').innerHTML = userlvl.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-race').innerHTML = userrace.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-class').innerHTML = userclass.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-other').innerHTML = userother.replace(/(<scr)/gi, '.');
    });
    
    var userStats = firebase.database().ref('/users/' + userId + '/stats/')
    userStats.once('value').then(function(snapshot) {
        var userstr = (snapshot.val() && snapshot.child('str').val()) || '?';
        var userdex = (snapshot.val() && snapshot.child('dex').val()) || '?';
        var usercon = (snapshot.val() && snapshot.child('con').val()) || '?';
        var userint = (snapshot.val() && snapshot.child('int').val()) || '?';
        var userwis = (snapshot.val() && snapshot.child('wis').val()) || '?';
        var usercha = (snapshot.val() && snapshot.child('cha').val()) || '?';
        document.getElementById('id-userview-str').innerHTML = userstr.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-dex').innerHTML = userdex.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-con').innerHTML = usercon.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-int').innerHTML = userint.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-wis').innerHTML = userwis.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-cha').innerHTML = usercha.replace(/(<scr)/gi, '.');
    });
    
    var userCoins = firebase.database().ref('/users/' + userId + '/coins/')
    userCoins.once('value').then(function(snapshot) {
        var usercp = (snapshot.val() && snapshot.child('cp').val()) || '0';
        var usersp = (snapshot.val() && snapshot.child('sp').val()) || '0';
        var userep = (snapshot.val() && snapshot.child('ep').val()) || '0';
        var usergp = (snapshot.val() && snapshot.child('gp').val()) || '0';
        var userpp = (snapshot.val() && snapshot.child('pp').val()) || '0';
        var usergm = (snapshot.val() && snapshot.child('gm').val()) || '0';
        document.getElementById('id-userview-cp').innerHTML = usercp.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-sp').innerHTML = usersp.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-ep').innerHTML = userep.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-gp').innerHTML = usergp.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-pp').innerHTML = userpp.replace(/(<scr)/gi, '.');
        document.getElementById('id-userview-gm').innerHTML = usergm.replace(/(<scr)/gi, '.');
        
        
        /* 
        Coin	        CP	    SP	    EP	    GP	    PP
        Copper (cp)	    1	    1/10	1/50	1/100	1/1,000
        Silver (sp)	    10	    1	    1/5	    1/10	1/100
        Electrum (ep)	50	    5	    1	    1/2	    1/20
        Gold (gp)	    100	    10	    2	    1	    1/10
        Platinum (pp)	1,000	100	    20	    10	    1
        Source: https://roll20.net/compendium/dnd5e/Treasure
        */
        
        var mTotal = 0.01 * parseInt(usercp) + 0.1 * parseInt(usersp) + 0.5 * parseInt(userep) + 1.0 * parseInt(usergp) + 10 * parseInt(userpp); 
        
        document.getElementById('id-userview-total').innerHTML = mTotal;
        
    });
    
    // get current notes
    var notesAct = document.getElementById('id-userview-notes-act').innerHTML.replace(/(<scr)/gi, '.');
    var userNotes = firebase.database().ref('/users/' + userId + '/notes/' + notesAct + '/')
    userNotes.once('value').then(function(snapshot) {
        var notes = snapshot.val() || '???';
        document.getElementById('id-userview-notes').innerHTML = notes.replace(/(<scr)/gi, '.');
        
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
    
    var userpp = document.getElementById('id-userview-pp').innerHTML.replace(/\W/g, '');
    var usergp = document.getElementById('id-userview-gp').innerHTML.replace(/\W/g, '');
    var userep = document.getElementById('id-userview-ep').innerHTML.replace(/\W/g, '');
    var usersp = document.getElementById('id-userview-sp').innerHTML.replace(/\W/g, '');
    var usercp = document.getElementById('id-userview-cp').innerHTML.replace(/\W/g, '');
    var usergm = document.getElementById('id-userview-gm').innerHTML.replace(/\W/g, '');
    
    var userNotes = document.getElementById('id-userview-notes').innerHTML.replace(/(<scr)/gi, '.');
    var notesAct  = document.getElementById('id-userview-notes-act').innerHTML.replace(/(<scr)/gi, '.');
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
        '/coins/pp'    : userpp,
        '/coins/gp'    : usergp,
        '/coins/ep'    : userep,
        '/coins/sp'    : usersp,
        '/coins/cp'    : usercp,
        '/coins/gm'    : usergm,
        [notesPath]     : userNotes     // not working in IE11
    })
    .catch(function (err) {
        console.log("save failed: ", err);
    });
    
    // close form
    userviewClose();
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

function saveActNotes(){
    
    // save current before moving to next...
    var userId = document.getElementById('id-userview-notes-id').innerHTML;
    var userNotes = document.getElementById('id-userview-notes').innerHTML;
    var notesAct  = document.getElementById('id-userview-notes-act').innerHTML;
    var notesPath = '/notes/' + notesAct;
    
    // update user data
    var oldsNotes = firebase.database().ref('/users/' + userId);
    oldsNotes.update({
        [notesPath] : userNotes     // not working in IE11
    })
    .catch(function (err) {
        console.log("save failed: ", err);
    });
    
}








///
///     STORY FUNCTIONS
///

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
    document.getElementById("id-story-menu").classList.toggle("show")
    
}

function storyChange( act, part ) 
{    
    changeStoryParts( "id-ctitle-div", "id-ptitle-div", "id-description", act, part );
    document.getElementById("id-story-div").scrollTop = 0;
    document.getElementById("id-arrow").classList.remove("noshow");
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








///
///     MORE STORY FUNCTIONS
///

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

function scroll_down( divId ) {
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
        var x = (point - start) / (end - start);
        return x*x*(3 - 2*x);
    }
    return new Promise(function(resolve, reject) {
        var previous_top = element.scrollTop;

        var scroll_frame = function() {
            if(element.scrollTop != previous_top) {
                reject("interrupted");
                return;
            }
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            if(now >= end_time) {
                resolve();
                return;
            }
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








///
///     QUEST FUNCTIONS
///

function getQuests(divID)
{
	var obj = document.getElementById(divID);
    
    var title = new Array();  
    var desc = new Array(); 
    
    quests.orderByValue().on("value", function(qstatus) {
    
        obj.innerHTML = "";
    
        var i = 0;
        var html = "";
        
        title   = [];
        desc    = []; 
    
        html = "<table id='quest-table'><tbody class='quest-tbody'>"
        html += "<tr class='ff7-header'>"
        
        html += "<td style='width:31px'></td>"
        html += "<td style='width:48px'></td>"
        html += "<td style='width:315px'>Title</td>"
        html += "<td style='width:107px' align='center'>Actions</td>"
        
        html += "</tr>"
        
        qstatus.forEach(function(quest) {
        
            quest.forEach(function(questid) {
                    
                questid.forEach(function(attribute) {
                    
                    if(attribute.key == "title") {
                        title[i] = attribute.val();
                    }
                    
                    if(attribute.key == "description") {
                        desc[i] = attribute.val();
                    }
                    else {
                        // empty ? 
                    }
                    
                });
                
                if( typeof title[i] != 'undefined' ) {

                    var newInfo = document.getElementById('id-quest-info'); 
                    var serializer = new XMLSerializer();
                    
                    html += "<tr class='quest-row quest-row-" + quest.key + "'>"   
                    
                    if(typeof desc[i] == 'undefined'){
                        desc[i] = "???"
                    }
                    
                    newImage = newInfo.cloneNode(true)
                    newImage.id = ( 'id-img-quest-' + questid.key )
                    newImage.classList.remove('icon-hide')
                    var imgstr = serializer.serializeToString(newImage);
                    
                    var qparams = '"' + quest.key + '","' + questid.key + '"'
                    
                    var newComp = document.getElementById('id-quest-complete'); 
                    var newProg = document.getElementById('id-quest-inprogress'); 
                    var newNots = document.getElementById('id-quest-notstarted'); 
                    var newRemd = document.getElementById('id-quest-removed'); 
                    
                    var imgCom = newComp.cloneNode(true)      // completed
                    var imgInp = newProg.cloneNode(true)      // in progress
                    var imgNos = newNots.cloneNode(true)      // not started
                    var imgRem = newRemd.cloneNode(true)      // removed
                    
                    imgCom.id = ( 'id-img-complete-' + questid.key )
                    imgCom.classList.remove('icon-hide')
                    imgInp.id = ( 'id-img-inprogress-' + questid.key )
                    imgInp.classList.remove('icon-hide')
                    imgNos.id = ( 'id-img-notstarted-' + questid.key )
                    imgNos.classList.remove('icon-hide')
                    imgRem.id = ( 'id-img-removed-' + questid.key )
                    imgRem.classList.remove('icon-hide')
                    
                    if( quest.key == "complete" ) {
                        newImage = newComp.cloneNode(true)
                        imgCom.classList.add('icon-hidden')
                    }
                    else if( quest.key == "inprogress" ) {
                        newImage = newProg.cloneNode(true)
                        imgInp.classList.add('icon-hidden')
                    }
                    else if( quest.key == "notstarted" ) {
                        newImage = newNots.cloneNode(true)
                        imgNos.classList.add('icon-hidden')
                    }
                    else if( quest.key == "removed" ) {
                        newImage = newRemd.cloneNode(true)
                        imgRem.classList.add('icon-hidden')
                    }
                    else {
                        newImage = newInfo.cloneNode(true)
                    }
                    
                    newImage.id = ( 'id-quest-svg-' + questid.key )
                    newImage.classList.remove('icon-hide')
                    
                    imgstat = serializer.serializeToString(newImage);
                    imgCom = serializer.serializeToString(imgCom);
                    imgInp = serializer.serializeToString(imgInp);
                    imgNos = serializer.serializeToString(imgNos);
                    imgRem = serializer.serializeToString(imgRem);
                    
                    shortTitle = title[i].split(":")[0].replace(/(<scr)/gi, '.')
                    if (shortTitle.length > 28) {
                        shortTitle = shortTitle.substring(0,25) + "...";
                    }
                    
                    // INFO
                    html += "<td class='qtd-info' align='center' onclick='questInfo(" + qparams + ")'>"
                    html += imgstr;
                    html += "</td>"
                    
                    // STATUS
                    html += "<td class='qtd-stat' id='id-quest-status-" + questid.key + "' align='center'>"
                    html += imgstat
                    html += "</td>"
                    
                    // TITLE
                    html += "<td class='qtd-title'>"
                    html += shortTitle
                    html += "</td>"
                    
                    // ACTIONS
                    html += "<td class='qtd-acts'>"
                    qparams = '"complete","' + questid.key + '"'
                    html += "<div class='qact-div' onclick='questStatusChange(" + qparams + ")'>" + imgCom + "</div>" 
                    qparams = '"inprogress","' + questid.key + '"'
                    html += "<div class='qact-div' onclick='questStatusChange(" + qparams + ")'>" + imgInp + "</div>" 
                    qparams = '"notstarted","' + questid.key + '"'
                    html += "<div class='qact-div' onclick='questStatusChange(" + qparams + ")'>" + imgNos + "</div>" 
                    qparams = '"removed","' + questid.key + '"'
                    html += "<div class='qact-div' onclick='questStatusChange(" + qparams + ")'>" + imgRem + "</div>" 
                    html += "</td>"
                    
                }
                i++; 
                
            });
                
        });    
        
        html += "</tbody></table>"  
        obj.innerHTML = html
        
        questOptionsLoginCheck()
        
    });
    
}

function questStatusChange( qstat, qid )
{
    questInfoReset(); 
    
    qstatOld = document.getElementById("id-quest-svg-" + qid);
    if(qstatOld.classList.contains("icon-comp")){
        qold = "complete"
    }
    else if(qstatOld.classList.contains("icon-inpr")){
        qold = "inprogress"
    }
    else if(qstatOld.classList.contains("icon-nots")){
        qold = "notstarted"
    }
    else if(qstatOld.classList.contains("icon-remo")){
        qold = "removed"
    }
    else {
        qold = "error"
    }
    
    var serializer = new XMLSerializer();
    var qstatImg = ""
    
    qstatImg = document.getElementById("id-img-complete-" + qid);
    qstatImg.classList.remove('icon-hidden');
    qstatImg = document.getElementById("id-img-inprogress-" + qid);
    qstatImg.classList.remove('icon-hidden');
    qstatImg = document.getElementById("id-img-notstarted-" + qid);
    qstatImg.classList.remove('icon-hidden');
    qstatImg = document.getElementById("id-img-removed-" + qid);
    qstatImg.classList.remove('icon-hidden');
    qstatImg = document.getElementById("id-quest-status-" + qid);
        
    if( qstat == "complete" ) {
        
        var newComp = document.getElementById('id-quest-complete'); 
        var imgCom = newComp.cloneNode(true); 
        
        imgCom.id = ( 'id-quest-svg-' + qid );
        imgCom.classList.remove('icon-hide');
        imgCom = serializer.serializeToString(imgCom);
        
        qstatImg.innerHTML = imgCom;
        qstatImg = document.getElementById("id-img-complete-" + qid);
        qstatImg.classList.add('icon-hidden');
    }
    else if( qstat == "inprogress" ) {
        
        var newProg = document.getElementById('id-quest-inprogress'); 
        var imgInp = newProg.cloneNode(true);
        
        imgInp.id = ( 'id-quest-svg-' + qid );
        imgInp.classList.remove('icon-hide');
        imgInp = serializer.serializeToString(imgInp);
        
        qstatImg.innerHTML = imgInp;
        qstatImg = document.getElementById("id-img-inprogress-" + qid);
        qstatImg.classList.add('icon-hidden');
    }
    else if( qstat == "notstarted" ) { 
    
        var newNots = document.getElementById('id-quest-notstarted');                         
        var imgNos = newNots.cloneNode(true);  
        
        imgNos.id = ( 'id-quest-svg-' + qid );
        imgNos.classList.remove('icon-hide');
        imgNos = serializer.serializeToString(imgNos);
        
        qstatImg.innerHTML = imgNos;
        qstatImg = document.getElementById("id-img-notstarted-" + qid);
        qstatImg.classList.add('icon-hidden');
    }
    else if( qstat == "removed" ) {
        
        var newRemd = document.getElementById('id-quest-removed'); 
        var imgRem = newRemd.cloneNode(true);
        
        imgRem.id = ( 'id-quest-svg-' + qid );
        imgRem.classList.remove('icon-hide');
        imgRem = serializer.serializeToString(imgRem);
        
        qstatImg.innerHTML = imgRem;
        qstatImg = document.getElementById("id-img-removed-" + qid);
        qstatImg.classList.add('icon-hidden');
    }
    
    questMove( qold, qstat, qid);
}

function questMove(oldDir, newDir, questId) {  
    
    if( oldDir != newDir ) {
    
        var oldQuest = firebase.database().ref('/quests/' + oldDir + "/" + questId )
        var newQuest = firebase.database().ref('/quests/' + newDir + "/" + questId )
        
        oldQuest.once('value').then( function(snapshot) {
            newQuest.set( snapshot.val(), function(error) {
                if( !error ) {  
                    var qTime = Date.now();
                    oldQuest.remove(); 
                    newQuest.update({
                        '/bychanged'    : ggId,
                        '/datechanged'   : qTime
                    })
                    .catch(function (err) {
                        console.log("save failed: ", err);
                    });
                }
                else { console.log( "error: " + error ) } 
            });
        });
        
    }
}

function questInfo( qStat, qid )
{
    var questBottom = document.getElementById("id-qbot-div")
    var qDescription = firebase.database().ref( '/quests/' + qStat + '/' + qid )
    
    globalQuestInfoId = qid;
    
    qDescription.once('value').then(function(snapshot) {
        
        questBottom.innerHTML = "<div>";
        
        var qStatString = ""
        if( qStat == "complete" ) {
            qStatString = "Complete"
        }
        else if( qStat == "inprogress" ) {
            qStatString = "In Progress" 
        }
        else if( qStat == "notstarted" ) {
            qStatString = "Not Started"
        }
        else if( qStat == "removed" ) {
            qStatString = "Removed" 
        }
        else {
            qStatString = "Unknown"
        }
        
        var qTitle = snapshot.child("/title").val();
        var qDescr = snapshot.child("/description").val();
        qTitle = qTitle.replace(/(<scr)/gi, '.');
        qDescr = qDescr.replace(/(<scr)/gi, '.');
        
        questBottom.innerHTML += "Title: " + qTitle;
        questBottom.innerHTML += "<br>Status: " + qStatString;
        questBottom.innerHTML += "<br><br>" + qDescr;
        questBottom.innerHTML += "</div>";
        
        var prefix = "questid-";
        var classes = questBottom.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        questBottom.className = classes.join(" ").trim();
        questBottom.classList.add( "questid-" + qid )
        
        // prep for "edit" mode
        // only if not already editing
        if( !isQuestEdit ) {
            questEditPrep( qTitle, qStat, qDescr, qid );
        }
        
    });
    
    document.getElementById("id-qopts-edit").classList.remove("noshow")
}

function questNew() {
    
    isQuestEdit = false; 
    globalQuestId = 0;
    
    document.getElementById("id-qbot-div").classList.add("noshow")
    document.getElementById("id-qbot-new").classList.add("show")
    
    var qStats = document.getElementById("id-status-edit");
    var qStats = document.getElementById("id-status-edit");
    qStats.value = "notstarted";
    
    document.getElementById('id-title-edit').innerHTML = "???";
    document.getElementById('id-description-edit').innerHTML = "...";
    
    document.getElementById("id-qopts-edit").classList.add("noshow")
    document.getElementById("id-qopts-save").classList.remove("noshow")
    document.getElementById("id-qopts-cancel").classList.remove("noshow")
    
}

function questSave() {

    var qSaveTime = Date.now();
    
    var qTitle = document.getElementById('id-title-edit').innerHTML.replace(/(<scr)/gi, '.');
    var qDescr = document.getElementById('id-description-edit').innerHTML.replace(/(<scr)/gi, '.');
    
    var qStats = document.getElementById("id-status-edit");
    var qNewIndex = qStats.options[qStats.selectedIndex].value;
    
    // if edit then update
    // if new create entry
    
    if ( isQuestEdit && ( globalQuestId != 0 ) ) {
        
        var oldQuest = firebase.database().ref('/quests/' + globalQuestOldStatus + "/" + globalQuestId );
        var newQuest = firebase.database().ref('/quests/' + qNewIndex + "/" + globalQuestId );
        var localQuestId = globalQuestId;
        
        oldQuest.once('value').then( function(snapshot) {
            newQuest.set( snapshot.val(), function(error) {
                if( !error ) {  
                    var qTime = Date.now();
                    oldQuest.remove(); 
                    newQuest.update({
                        '/bychanged'    : ggId,
                        '/bycreated'    : snapshot.child("/bycreated").val(),
                        '/datechanged'  : qTime,
                        '/datecreated'  : snapshot.child("/datecreated").val(),
                        '/description'  : qDescr,
                        '/title'        : qTitle
                    })
                    .catch(function (err) {
                        console.log("save failed: ", err);
                    });
                    
                    questInfo( qNewIndex, localQuestId )
                }
                else { console.log( "error: " + error ) } 
            });
            
        });
        
    }
    else {
        
        var newQuestData = firebase.database().ref('/quests/' + qNewIndex + "/" + qSaveTime);
        
        // create new quest
        newQuestData.update({
            '/bychanged'    : ggId,
            '/bycreated'    : ggId,
            '/datechanged'  : qSaveTime,
            '/datecreated'  : qSaveTime,
            '/description'  : qDescr,
            '/title'        : qTitle
        })
        .catch(function (err) {
            console.log("save failed: ", err);
        });
    
        questInfo( qNewIndex, qSaveTime )
    
    }
    
    document.getElementById("id-qbot-div").classList.remove("noshow")
    document.getElementById("id-qbot-new").classList.remove("show")
    
    document.getElementById("id-qopts-save").classList.add("noshow")
    document.getElementById("id-qopts-cancel").classList.add("noshow")
    
    isQuestEdit = false; 
    globalQuestId = 0;
    globalQuestOldStatus = "";
    
}

function questEdit() {
    
    isQuestEdit = true; 
    
    var qStats = document.getElementById("id-status-edit");
    globalQuestOldStatus = qStats.options[qStats.selectedIndex].value;
    
    // other data already pre-populated when user clicked "info" icon  
    
    document.getElementById("id-qbot-div").classList.add("noshow")
    document.getElementById("id-qbot-new").classList.add("show")
    
    document.getElementById("id-qopts-edit").classList.add("noshow")
    document.getElementById("id-qopts-save").classList.remove("noshow")
    document.getElementById("id-qopts-cancel").classList.remove("noshow")
    
}

function questEditPrep( questTitle, questStatus, questDescription, questId ) {
    
    var qStats = document.getElementById("id-status-edit");
    qStats.value = questStatus;
    
    document.getElementById('id-title-edit').innerHTML = questTitle;
    document.getElementById('id-description-edit').innerHTML = questDescription;
    
    globalQuestId = questId;
}

function questCancel() {
    
    isQuestEdit = false; 
    globalQuestId = 0;
    
    document.getElementById("id-qbot-div").classList.remove("noshow")
    document.getElementById("id-qbot-new").classList.remove("show")
    
    document.getElementById("id-qopts-save").classList.add("noshow")
    document.getElementById("id-qopts-cancel").classList.add("noshow")
    
    questInfoReset();
    
}

function questOptionsLoginCheck() {
    
    // user is logged in
    if( ggId > 999999 ) {
        
        document.getElementById("id-qopts-new").classList.remove("quest-gone")
        document.getElementById("id-qopts-edit").classList.remove("quest-gone")
        document.getElementById("id-qopts-save").classList.remove("quest-gone")
        document.getElementById("id-qopts-cancel").classList.remove("quest-gone")
        
        var actions = document.getElementsByClassName("qact-div");
        for(var i = 0; i < actions.length; i++)
        {
            actions.item(i).classList.remove("quest-gone")
        }
        
        
    }
    // user not logged in
    else {
        
        document.getElementById("id-qopts-new").classList.add("quest-gone")
        document.getElementById("id-qopts-edit").classList.add("quest-gone")
        document.getElementById("id-qopts-save").classList.add("quest-gone")
        document.getElementById("id-qopts-cancel").classList.add("quest-gone")
        
        var actions = document.getElementsByClassName("qact-div");
        for(var i = 0; i < actions.length; i++)
        {
            actions.item(i).classList.add("quest-gone")
        }
        
    }
    
}

function questFilter( qType ) {
    
    var qAllClass = document.getElementsByClassName("quest-row");
    for(var i = 0; i < qAllClass.length; i++)
    {
        qAllClass.item(i).classList.remove("noshow")
    }
    
    var qRemClass = document.getElementsByClassName("quest-row-removed");
    var qComClass = document.getElementsByClassName("quest-row-complete");
    var qInpClass = document.getElementsByClassName("quest-row-inprogress");
    var qNotClass = document.getElementsByClassName("quest-row-notstarted");
    
    // if All
    // hide removed
    if( qType == "All" ) {
        for(var i = 0; i < qRemClass.length; i++)
        {
            qRemClass.item(i).classList.add("noshow")
        }
    }
    
    // if Active
    // hide complete
    // hide removed
    if( qType == "Active" ) {
        for(var i = 0; i < qComClass.length; i++)
        {
            qComClass.item(i).classList.add("noshow")
        }
        for(var i = 0; i < qRemClass.length; i++)
        {
            qRemClass.item(i).classList.add("noshow")
        }
    }
    
    // if Complete
    // hide inprogress
    // hide notstarted
    // hide removed
    if( qType == "Complete" ) {
        for(var i = 0; i < qInpClass.length; i++)
        {
            qInpClass.item(i).classList.add("noshow")
        }
        for(var i = 0; i < qNotClass.length; i++)
        {
            qNotClass.item(i).classList.add("noshow")
        }
        for(var i = 0; i < qRemClass.length; i++)
        {
            qRemClass.item(i).classList.add("noshow")
        }
    }
    
    // if Deleted
    // hide complete
    // hide inprogress
    // hide notstarted
    if( qType == "Deleted" ) {
        for(var i = 0; i < qComClass.length; i++)
        {
            qComClass.item(i).classList.add("noshow")
        }
        for(var i = 0; i < qInpClass.length; i++)
        {
            qInpClass.item(i).classList.add("noshow")
        }
        for(var i = 0; i < qNotClass.length; i++)
        {
            qNotClass.item(i).classList.add("noshow")
        }
    }
    
}

function questInfoReset() {
    
    qBotOld = document.getElementById("id-qbot-div");    
    
    if( qBotOld.classList.contains( "questid-" + globalQuestInfoId ) ){
        qBotOld.classList.remove( "questid-" + globalQuestInfoId )
    }    
        
    qBotOld.innerHTML = '<div><i>Use <svg id="id-quest-info" class="icon-grey icon-small" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" /></svg> to select quest.<br></i></div>'

    document.getElementById("id-qopts-edit").classList.add("noshow")
}










///
///     MENU FUNCTIONS
///

function menuClick(){
    
    questOptionsLoginCheck();
    
    document.getElementById("id-settings").classList.toggle("show");
    document.getElementById("id-story-div").classList.toggle("noshow");
    document.getElementById("id-title-div").classList.toggle("noshow");
    document.getElementById("id-description").classList.toggle("noshow");
    
}

var md1 = 0; 
var mMenuRotate = 0;
function menuUpClick(){
    
    md1 += 180;
    mMenuRotate += 180;
    
    document.getElementById("id-title-div").classList.toggle("noshow");
    document.getElementById("id-subtitle-div").classList.toggle("noshow");
    
    // rotate the arrows
    document.getElementById("id-svg-min").setAttribute("transform", "rotate(" + mMenuRotate + ")");

    document.getElementById("id-svg-double1").setAttribute("transform", "rotate(" + md1 + ")");
    
    clearSelection(); 
    
}

function menuUpClickDouble(){
    
    console.log("double do menuDoubleUpClick...")
    
    
    // minimize header and the character+quest field
    menuUpClick();
    tabsMinimizeClick(); 
    
    
}

var md2 = 0; 
var mTabsRotate = 0;
function tabsMinimizeClick(){
    
    md2 += 180;
    mTabsRotate += 180;
    
    document.getElementById("id-tab-div").classList.toggle("noshow");
    
    document.getElementById("firebaseusers-div").classList.toggle("noshow");
    document.getElementById("firebasequests-div").classList.toggle("noshow");
    
    // remove maps if displayed 
    if( !document.getElementById("id-maps-div").classList.contains("noshow") ){
        document.getElementById("id-maps-div").classList.toggle("noshow");
    }
    
    // rotate the arrows
    document.getElementById("id-svg-otab-up").setAttribute("transform", "rotate(" + mTabsRotate + ")");
    document.getElementById("id-svg-double2").setAttribute("transform", "rotate(" + md2 + ")");
    
    clearSelection(); 
    
}
function tabsVerticalClick(){
    
    console.log("do tabsVerticalClick...")
    
    
}
function tabsHorizontalClick(){
    
    console.log("do tabsHorizontalClick...")
    
    
}






function charsClick(){
    
    // remove quests log if displayed
    if( document.getElementById("id-quests-div").classList.contains("show") ){
        document.getElementById("id-quests-div").classList.toggle("show");
    }
    // remove maps if displayed 
    if( !document.getElementById("id-maps-div").classList.contains("noshow") ){
        document.getElementById("id-maps-div").classList.toggle("noshow");
    }
    
    removeNoShow("qbot-div"); 
    removeShow("qbot-new-div"); 
    
    getQuests("id-qtop-div");
    
    questOptionsLoginCheck();
    
    // remove maps or quest variables from url if present
    if ( document.location.href.includes("map=1") || 
         document.location.href.includes("quests=1")
        ) {
        window.history.pushState('Characters', 'Title', addParam('', '', '') );
    }
    
}

function questsClick(){
    
    document.getElementById("id-quests-div").classList.toggle("show");
    document.getElementById("id-qbot-div").classList.add("show");
    
    // remove maps if displayed 
    if( !document.getElementById("id-maps-div").classList.contains("noshow") ){
        document.getElementById("id-maps-div").classList.toggle("noshow");
    }
    
    removeNoShow("qbot-div"); 
    removeShow("qbot-new-div"); 
    
    getQuests("id-qtop-div");
    
    // questOptionsLoginCheck();
    
    // if not contain quests
    if ( !document.location.href.includes("quests=1") ) {
        window.history.pushState('Quests', 'Title', addParam('', 'quests', '1') );
    }
    
}

function mapsClick(){
    
    // display map
    document.getElementById("id-maps-div").classList.toggle("noshow");
    
    // remove quests log if displayed
    if( document.getElementById("id-quests-div").classList.contains("show") ){
        document.getElementById("id-quests-div").classList.toggle("show");
    }
    
    
    //var url = new URL("http://foo.bar/?x=1&y=2");
    //url.searchParams.set('map', 1);
    //document.location.search = addParam('foobar', 'map', '2')
    
    //var foobar = document.location
    //console.log( foobar.includes("map=1") );
    
    //var foobar = document.location.href ;
    //console.log( foobar );
    
    // if not contain map
    if ( !document.location.href.includes("map=1") ) {
        window.history.pushState('Map', 'Title', addParam('', 'map', '1') );
    }
    
    
}








///
///     THEME FUNCTIONS
///

function setTheme(themeID){

// ELEMENT CLASS
    var menus = document.getElementsByClassName("ff7");
    var i;
    
    if(!themeID){
        // themeID = "ff7-0"
        themeID = "ff7-ios"
    }
    
    for (i = 0; i < menus.length; i++) {
        var openMenu = menus[i];
        if ( openMenu.classList.contains('ff7') && 
            !openMenu.classList.contains('setting-selection') && 
            !openMenu.classList.contains('settings-close')  && 
            !openMenu.classList.contains('userview-close')  && 
            !openMenu.classList.contains('quests-close')  && 
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
            openMenu.classList.remove('ff7-ios')
            
            openMenu.classList.add(themeID);
        }
    }
    
    document.getElementById("id-loading-div").classList.add("noshow");
    
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
    document.getElementById("id-story-div").classList.toggle("noshow");
    document.getElementById("id-title-div").classList.toggle("noshow");
}

function settingsCancel() {
    var mThemeOld = getCookie('theme-saved')
    setTheme(mThemeOld)
    removeShow("settings-div");
    removeNoShow("description-div");
    document.getElementById("id-story-div").classList.toggle("noshow");
    document.getElementById("id-title-div").classList.toggle("noshow");
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








///
///     LOGIN FUNCTIONS
///

function renderButton() {
    gapi.signin2.render('id-gSign', {
        'scope': 'profile email',
        //'width': 30,
        //'height': 20,
        //'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function onSuccess(googleUser) {
    ggName = googleUser.getBasicProfile().getName()
    ggId = googleUser.getBasicProfile().getId()
    
	var gsignElement = document.getElementById("id-gSign");
	var userMessage = document.getElementById("id-ggwelcome-div");
    
    userMessage.innerHTML = "Welcome, " + ggName.split(" ")[0];
    //userMessage.innerHTML = "User: " + ggName + ", " + ggId;
    
    removeNoShow("gguser-div"); 
    gsignElement.innerHTML = ""; 
    
    questOptionsLoginCheck();
    
}

function onFailure(error) {
	var userMessage = document.getElementById("id-ggwelcome-div");
    //userMessage.innerHTML = " Use Menu to Login > > > ";
}








///
///     MISC FUNCTIONS
///

function clearSelection()
{
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
}

function removeShow(elementName) {
    var mClass = document.getElementsByClassName(elementName);
    var i;
    for (i = 0; i < mClass.length; i++) {
        var openClass = mClass[i];
        if (openClass.classList.contains('show')) {
            openClass.classList.remove('show');
        }
    }
}
function removeNoShow(elementName) {
    var mClass = document.getElementsByClassName(elementName);
    var i;
    for (i = 0; i < mClass.length; i++) {
        var openClass = mClass[i];
        if (openClass.classList.contains('noshow')) {
            openClass.classList.remove('noshow');
        }
    }
}
function removeClassFromDiv( elementName, className ) {
    var mClass = document.getElementsByClassName(elementName);
    var i;
    for (i = 0; i < mClass.length; i++) {
        var openClass = mClass[i];
        if (openClass.classList.contains( className )) {
            openClass.classList.remove( className );
        }
    }
}

document.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
    
    //console.log(document.activeElement.id)
    
    if( 
        document.activeElement.id != "id-userview-notes" &&
        document.activeElement.id != "id-description-edit"
    )
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

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    
    var a = !event.target.matches('.dropbtn');
    var c = event.target.matches('.settings-close');
    var d = event.target.classList.contains('setting-selection');
    
    var f = !event.target.classList.contains('ctitle-div');
    var g = !event.target.classList.contains('ptitle-div');
    
    var h = !event.target.classList.contains('qtab-div');
    var i = !event.target.classList.contains('quests-div');
    
    //var b = !event.target.matches('.clickarea-div');
    //var e = event.target.matches('.userview-close');
    
    //console.log("target: ");
    //console.log(event.target);
    //console.log("target.id: " + event.target.id);
    
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
    
    /*
    if ( h && i ) {
        removeShow("quests-div"); 
    }
    */
    
    /*
    if ( c ) {
    }
    */
    
    /*
    if ( e ) {
        console.log('userview-close: ' + ggId);
        removeShow("userview-div"); 
        settingsSave() 
    }
    */
}








