
var config = {
  apiKey: "AIzaSyClcH0NPVJJ5ToYDZd8nLbthBGlMNVjZ0M",
  authDomain: "python-clockwork-warriors.firebaseapp.com",
  databaseURL: "https://python-clockwork-warriors.firebaseio.com",
};

firebase.initializeApp(config);

var ping = firebase.database().ref('_ping');
var users = firebase.database().ref('users');
//var ghosts = firebase.database().ref('ghosts');
//var ghosts = firebase.database().ref('chapters');

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


function getUsers(divID)
{
	var obj = document.getElementById(divID);
    
    obj.innerHTML = ""
    
    var chars = new Array(); 
    var lvl = new Array();    
    var hps = new Array(); 
    var exp = new Array();  
    
    users.orderByValue().on("value", function(characters) {
    
        var html = ""
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
            //obj.innerHTML += "<div>" + "user: " + userid.key + "</div>";
                
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
                // skip
            
                /*
                if(typeof chars[i] == 'undefined'){
                    chars[i] = "???"
                } 
                */
                
                if(typeof lvl[i] == 'undefined'){
                    lvl[i] = "?"
                }            
                if(typeof hps[i] == 'undefined'){
                    hps[i] = "?"
                }            
                if(typeof exp[i] == 'undefined'){
                    exp[i] = "?"
                }            
                //html += "<td style='width:150px'>"
                html += "<td>"
                html += chars[i]
                html += "</td>"
                
               // html += "<td style='width:50px'>"
                html += "<td>"
                html += lvl[i]
                html += "</td>"
                
                //html += "<td style='width:120px' align='center'>"
                html += "<td align='center'>"
                html += hps[i] + " / " + hps[i]
                html += "</td>"
                
                //html += "<td style='width:100px' align='center'>"
                html += "<td align='center'>"
                html += exp[i]
                html += "</td>"  
                
                var userId = userid.key
                
                userId1 = userId.slice(0,10)
                userId2 = userId.slice(10,userId.length)
                
                //html += "<td style='width:150px' align='center'>"
                html += "<td align='center'>"
                html += "<button type='button' class='ff7' "
                html += "onclick='claimExp("
                html += userId1 + "," + userId2
                html += ")'>Action</button></td></td>"
                
                html += "</tr>"   
            }
            i++;   
            
        });        
        
        html += "</table>"        
        obj.innerHTML = html
        
    });
    
}






























