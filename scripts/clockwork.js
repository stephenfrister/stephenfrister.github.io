
var config = {
  apiKey: "AIzaSyClcH0NPVJJ5ToYDZd8nLbthBGlMNVjZ0M",
  authDomain: "python-clockwork-warriors.firebaseapp.com",
  databaseURL: "https://python-clockwork-warriors.firebaseio.com",
};

firebase.initializeApp(config);

var ping = firebase.database().ref('_ping');
var users = firebase.database().ref('users');


//var ghosts = firebase.database().ref('ghosts');


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
	exp.transaction(function (current_value) {
		return (current_value || 0) + 1; 
	});
    
}	



var chapters = firebase.database().ref('chapters');
var chapterAct = firebase.database().ref('chapters/active');
var chapterPart = firebase.database().ref('chapters/activepart');


function getTitleAct(divID)
{
    var html = ""
    //var obj = document.getElementById(divID);  
    chapterAct.on("value", function(snapshot) {
         //obj.innerHTML = snapshot.val();
         html = setTitleAct( divID, snapshot.val() )
    });
    
    var obj = document.getElementById(divID);
    obj.innerHTML = html;
    
    
}

function setTitleAct( divID, chapter )
{  
    
    //var chapters = firebase.database().ref('chapters');
    //var mvar = firebase.database().ref('chapters/' + chapter + "/title")
    
    //var html = ""
    //return firebase.database().ref('/users/' + userId).once('value').then( 
    //return firebase.database().ref('chapters/' + chapter + "/title").once('value').then( 
        //function(snapshot) {
            //html = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        //}
    //);
    
    //var obj = document.getElementById(divID);
    //obj.innerHTML = html;
         
}

/*
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
// ...
});

var userId = firebase.auth().currentUser.uid;
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
         
mvar.on("value", function(snapshot) {
     obj.innerHTML = snapshot.val();
});
*/



//var mvar = firebase.database().ref('chapters/' + 0 + "" + 1 + "")

function getTitlePart(divID)
{
    var obj = document.getElementById(divID);  
    chapterPart.on("value", function(snapshot) {
         obj.innerHTML = snapshot.val();
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

    //var dynamicChapter = firebase.database().ref('chapters/' + act + "/" + part + "/description") 

function getStory(divID)
{
    // var fb_act = chapters.database().ref('active/');
    // var fb_act = chapters.database().ref('chapters/active');
    //var fb_part = firebase.database().ref('chapters/activeparts');
    
	//var obj = document.getElementById(divID);
    //obj.innerHTML = "";
    
    //chapters.on("value", function(snapshot) {
    //     obj.innerHTML = snapshot.val();
    //});
    
    var act = ""
    var part = ""
    var ctitle = ""
    var ptitle = ""
    var description = ""
    
    /*
    fb_part.on('value', function(snapshot) {
        part = snapshot.val();
    });
    
    var fb_ctitle = firebase.database().ref('chapters/' + act + '/title');
    var fb_ptitle = firebase.database().ref('chapters/' + act + '/' + '/' + part + '/title');
    var fb_description = firebase.database().ref('chapters/' + act + '/' + '/' + part + '/description');
    
    fb_ctitle.on('value', function(snapshot) {
        ctitle = snapshot.val();
    });
    fb_ptitle.on('value', function(snapshot) {
        ptitle = snapshot.val();
    });
    fb_description.on('value', function(snapshot) {
        description = snapshot.val();
    });
    */
    
    
    var html = "";
    
    html = "<div>"
    //html += "Test"
    html += act
    html += part
    html += ctitle
    html += ptitle
    html += description
    html += "</div>"
    
    //obj.innerHTML = html;
    
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
    
        var html = ""
        var dropdowns = ""
        var i = 0; 
    
        html = "<table id='users-table'>"
        
        html += "<tr class='ff7-header'>"
        html += "<td style='width:150px'>Name</td>"
        html += "<td style='width:50px'>Lvl</td>"
        html += "<td style='width:150px' align='center'>Energy</td>"
        html += "<td style='width:100px' align='center'>Exp</td>"
        html += "<td style='width:50px'> </td>"
        html += "</tr>"
        
        characters.forEach(function(userid) {
            html += "<tr>"
                
            userid.forEach(function(attribute) {
                
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
                else if(attribute.key == "level") {
                    lvl[i] = attribute.val();
                }
                
                else if( attribute.key == "power" || attribute.key == "magic" ) {
                    // empty for now
                }
                else {
                    // empty ? 
                }
                
            });
            
            if(typeof chars[i] != 'undefined') {
                
                if(typeof lvl[i] == 'undefined'){
                    lvl[i] = "?"
                }            
                if(typeof hps[i] == 'undefined'){
                    hps[i] = "?"
                }            
                if(typeof exp[i] == 'undefined'){
                    exp[i] = "?"
                }            
                html += "<td>"
                html += chars[i]
                html += "</td>"
                
                html += "<td>"
                html += lvl[i]
                html += "</td>"
                
                html += "<td align='center'>"
                html += hps[i] + " / " + hps[i]
                html += "</td>"
                
                html += "<td align='center'>"
                html += exp[i]
                html += "</td>"  
                
                var userId = userid.key
                
                userId1 = userId.slice(0,10)
                userId2 = userId.slice(10,userId.length)
                
                html += "<td align='center'>"
                html += "<button "
                html += "type='action-button' "
                html += "class='ff7 dropbtn' "
                html += "onclick='actionClick("
                html += userId1 + "," + userId2
                html += ")' >"
                html += "Action</button></td></td>"
                
                html += "</tr>"   
            }
            i++;   
            
        });        
        
        html += "</table>"  
        //html += dropdowns 
        
        obj.innerHTML = html
        
    });
    
}


function actionClick(userId1, userId2)
{
    document.getElementById("actionMenu").classList.toggle("show");
    
    var mString = "onclick=claimExp(" + userId1 + "," + userId2 + ")"
    document.getElementById("actionMenuExp").setAttribute("onclick", mString);
    
    document.getElementById("actionMenuAttack").style.color = "#33334d";
    document.getElementById("actionMenuMagic").style.color = "#33334d";
    document.getElementById("actionMenuItem").style.color = "#33334d";
    
    document.getElementById("actionMenuAttack").className = "disabled-hover";
    document.getElementById("actionMenuMagic").className = "disabled-hover";
    document.getElementById("actionMenuItem").className = "disabled-hover";
    
    //document.getElementById("actionMenuAttack").setAttribute("onclick", mString);
    //document.getElementById("actionMenuMagic").setAttribute("onclick", mString);
    //document.getElementById("actionMenuItem").setAttribute("onclick", mString);
    
    //document.getElementById("actionMenu").innerHTML = "whatever";
    //document.getElementById("actionMenu").setAttribute("id", "div_top1");
    
}	

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("actionmenu-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}





























