
var foo = "bar"; 
var ping = new Firebase('https://github-website-sgf.firebaseio.com/ping');

function pingup()
{
	//alert('Hi');
	//alert(foo); 
	ping.transaction(function (current_value) {
	return (current_value || 0) + 1; 
	});
}	
