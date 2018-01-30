
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
    //var userId = userId1.concat(userId2);
    //userId = ""
    //userId = 
    var exp = firebase.database().ref('users/' + userId + '/exp' );
    //var exp = firebase.database().ref('users/108360043117969116770/exp' );
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
    
        html = "<table id='table2'>"
        
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
            
            if(typeof chars[i] == 'undefined'){
                chars[i] = "???"
            }            
            if(typeof lvl[i] == 'undefined'){
                lvl[i] = "?"
            }            
            if(typeof hps[i] == 'undefined'){
                hps[i] = "?"
            }            
            if(typeof exp[i] == 'undefined'){
                exp[i] = "?"
            }            
            html += "<td style='width:150px'>"
            html += chars[i]
            html += "</td>"
            
            html += "<td style='width:50px'>"
            html += lvl[i]
            html += "</td>"
            
            html += "<td style='width:50px'>"
            html += hps[i]
            html += "</td>"
            
            html += "<td style='width:100px'>"
            html += exp[i]
            html += "</td>"  
            
            //var userId = "108360043117969116770"
            var userId = userid.key
            
            userId1 = userId.slice(0,10)
            userId2 = userId.slice(10,userId.length)
            
            html += "<td style='width:150px'>"
            html += "<button type='button' "
            html += "onclick='claimExp("
            html += userId1 + "," + userId2
            html += ")'>Claim Daily Exp</button></td></td>"
            
            html += "</tr>"
            i++;      
            
        });        
        
        html += "</table>"        
        obj.innerHTML = html
        
    });
    
}






























