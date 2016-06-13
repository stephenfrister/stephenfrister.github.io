
var ping = new Firebase('https://github-website-sgf.firebaseio.com/ping');
var totalGob = new Firebase('https://github-website-sgf.firebaseio.com/goblins');
var totalMin = new Firebase('https://github-website-sgf.firebaseio.com/minerals');
var totalCon = new Firebase('https://github-website-sgf.firebaseio.com/construction');


function hunting(count)
{
	goblins.transaction(function (current_value) {
	return (current_value || 0) + count; 
	});
}	

function mining()
{
	minerals.transaction(function (current_value) {
	return (current_value || 0) + 1; 
	});
}	

function build()
{
	construction.transaction(function (current_value) {
	return (current_value || 0) + 1; 
	});
}	

function getValue(type, divID)
{
	var obj = document.getElementById(divID);
	
	if(type == "totalGoblins")
	{				 
		totalGob.on("value", function(snapshot) {
			obj.innerHTML = snapshot.val();
			});
	}
	else if(type == "totalMinerals")
	{				 
		totalMin.on("value", function(snapshot) {
			obj.innerHTML = snapshot.val();
			});
	}
	else if(type == "totalBuildings")
	{				 
		totalCon.on("value", function(snapshot) {
			obj.innerHTML = snapshot.val();
			});
	}
	else
	{
		obj.innerHTML = "n/a";
	}
}

function pingServer()
{
	ping.transaction(function (current_value) {
	return (current_value || 0) + 1; 
	});
}	


/*
function randomDice(dice)
{
	var x = Math.floor((Math.random() * dice) + 1);
	return x;
}
*/

/*
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState == 4)
        {
            if(rawFile.status == 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}
*/
































