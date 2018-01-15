
var config = {
  apiKey: "AIzaSyClcH0NPVJJ5ToYDZd8nLbthBGlMNVjZ0M",
  authDomain: "python-clockwork-warriors.firebaseapp.com",
  databaseURL: "https://python-clockwork-warriors.firebaseio.com",
};

firebase.initializeApp(config);

var ping = firebase.database().ref('_ping');
var users = firebase.database().ref('users');

function pingServer()
{
	ping.transaction(function (current_value) {
		return (current_value || 0) + 1; 
	});
}	

function getUsers(divID)
{
	var obj = document.getElementById(divID);
	
	if(type == "clockworkUsersDiv")
	{				 
		totalGob.on("users", function(snapshot) {
			obj.innerHTML = snapshot.val();
			});
	}
}

/*

var ref = firebase.database().ref('node/clicks');
ref.transaction(function(currentClicks) {
  // If node/clicks has never been set, currentRank will be `null`.
  return (currentClicks || 0) + 1;
});

var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
starCountRef.on('value', function(snapshot) {
  updateStarCount(postElement, snapshot.val());
});

var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  // ...
});
*/


/*
function pingServer()
{
	ping.transaction(function (current_value) {
		return (current_value || 0) + 1; 
	});
}	
*/


/*
function foobar(divID)
{
	var obj = document.getElementById(divID);
	
	var HTML = ""
	
	obj.innerHTML = "";
	
	lists.on("value", function(snapshot) {
		//obj.innerHTML += "<div>" + snapshot.key() + "</div>";
		//obj.innerHTML += "<table style='width:100%'>"
		
		HTML = "<table>";
		
		snapshot.forEach(function(listKeys) {
			//obj.innerHTML += "<div>" + listKeys.key() + "</div>";
			HTML += "<tr>";
			HTML += "<td>" + listKeys.child("listName").val() + "</td>";
			HTML += "<td>" + listKeys.child("owner").val() + "</td>";			
			HTML += "</tr>";
		});
		HTML += "</table>"
		
		obj.innerHTML = HTML; 
		//obj.innerHTML += "</table>"
	});
	
	//obj.innerHTML = HTML; 
	
	//lists.orderByValue().on("value", function(snapshot) {
	// lists.once("value", function(snapshot) {
		// //obj.innerHTML += snapshot.val();
		// //obj.innerHTML += snapshot.key();
		// snapshot.forEach(function(childSnapshot) {
			// obj.innerHTML += "<div> foo: " + childSnapshot.key() + "</div>"; 
		// )};
	// });	

}
*/

/*
function foo()
{
	root.transaction(function (current_value) {
		return (current_value || 0) + 1; 
	});
}	
*/






























