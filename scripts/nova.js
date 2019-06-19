
var config = {
  apiKey: "AIzaSyClcH0NPVJJ5ToYDZd8nLbthBGlMNVjZ0M",
  authDomain: "python-clockwork-warriors.firebaseapp.com",
  databaseURL: "https://python-clockwork-warriors.firebaseio.com",
};

firebase.initializeApp(config);

var users = firebase.database().ref('users');
var quests = firebase.database().ref('quests');
var chapters = firebase.database().ref('chapters');




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