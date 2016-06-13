var ping = new Firebase('https://github-website-sgf.firebaseio.com/ping');
var goblins = new Firebase('https://github-website-sgf.firebaseio.com/goblins');
var minerals = new Firebase('https://github-website-sgf.firebaseio.com/minerals');
var construction = new Firebase('https://github-website-sgf.firebaseio.com/construction');



function make_Old_WorldGrid( col, row )
{
    var obj = document.getElementById("worldDiv");
    obj.innerHTML = old_worldGrid( row, col );
}

function old_worldGrid( col, row )
{
    var ret = "";
	var colSpace = 17;
	var rowSpace = 17;
	
	var rowOffset = 0; 
	var colOffset = 8;
	
	// var rowStart = 40;
	// var colStart = 30; 	
	var rowStart = 0;
	var colStart = 0; 	
	
	var top = 0; 
	var left = 0; 
	
    for( var r = 0; r < row ; r++ )
    {
        // ret += '<div id="Column'+(r+1)+'" style="float:left">';
        ret += '<div class="hexColumn" id="Column'+(r+1)+'">';
        for( var c = 0; c < col; c++ )
        {				
			if(r < 1 | c < 1)
			{
				ret += '<div class="hex hex-cloud"';
			}
			else if(r == 6 & c == 6)
			{
				ret += '<div class="hex hex-water"';
			}
			else if(r == 6 & c == 7)
			{
				ret += '<div class="hex hex-town" onclick="build();"';
			}
			else if(r == 6 & c == 8)
			{
				ret += '<div class="hex hex-town" onclick="build();"';
			}
			else if(r == 7 & c == 6)
			{
				ret += '<div class="hex hex-town" onclick="build();"';
			}
			else if(r == 7 & c == 7)
			{
				ret += '<div class="hex hex-town" onclick="build();"';
			}
			
			// 0 -> 5 , 0 -> 5	// hex-water	
			else if(( r > 0 & r < 5 ) & ( c > 0 & c < 5 )) 
			{
				ret += '<div class="hex hex-water"';
			}
			
			// 5 -> 10 , 0 -> 5	// hex-water	
			else if(( r > 5 & r < 10 ) & ( c > 0 & c < 5 )) 
			{
				ret += '<div class="hex hex-water"';
			}
			
			// 10 -> 15 , 0 -> 5	// hex-water			
			else if(( r > 10 & r < 15 ) & ( c > 0 & c < 5 )) 
			{
				ret += '<div class="hex hex-water"';
			}
						
			// 0 -> 5 , 5 -> 10	// hex-water			
			else if(( r > 0 & r < 5 ) & ( c > 5 & c < 10 )) 
			{
				ret += '<div class="hex hex-water"';
			}
			// 5 -> 10 , 5 -> 10	// hex-field	
			else if(( r > 5 & r < 10 ) & ( c > 5 & c < 10 )) 
			{
				ret += '<div class="hex hex-field" onclick="hunting(1);"';
			}
			// 10 -> 15 , 5 -> 10	// hex-forest	
			else if(( r > 10 & r < 15 ) & ( c > 5 & c < 10 )) 
			{
				ret += '<div class="hex hex-forest" onclick="hunting(2);"';
			}
			
			// 0 -> 5 , 10 -> 15	// hex-water
			else if(( r > 0 & r < 5 ) & ( c > 10 & c < 15 )) 
			{
				ret += '<div class="hex hex-water"';
			}
			// 5 -> 10 , 10 -> 15	// hex-forest			
			else if(( r > 5 & r < 10 ) & ( c > 10 & c < 15 )) 
			{
				ret += '<div class="hex hex-forest" onclick="hunting(2);"';
			}
			// 10 -> 15 , 10 -> 15	// hex-field
			else if(( r > 10 & r < 15 ) & ( c > 10 & c < 15 )) 
			{
				ret += '<div class="hex hex-field" onclick="hunting(1);"';
			}
			
			// 0 -> 5 , 15 -> 20	// hex-water
			else if(( r > 0 & r < 5 ) & ( c > 15 & c < 20 )) 
			{
				ret += '<div class="hex hex-water"';
			}
			// 5 -> 10 , 15 -> 20	// hex-mountain			
			else if(( r > 5 & r < 10 ) & ( c > 15 & c < 20 )) 
			{
				ret += '<div class="hex hex-mountain" onclick="mining();"';
			}			
			// 5 -> 10 , 15 -> 20	// hex-swamp			
			else if(( r > 10 & r < 15 ) & ( c > 15 & c < 20 )) 
			{
				ret += '<div class="hex hex-swamp"';
			}
			else
			{
				ret += '<div class="hex hex-cloud"';
			}
			
			if(r%2 == 0)
			{
				top = r * rowSpace + rowStart; 
				left = c * colSpace + colStart; 
			}
			else
			{
				top = r * rowSpace + rowStart + rowOffset;  
				left = c * colSpace + colStart + colOffset; 
			}
			ret += 'id="' + 'r:' + r + ',c:' + c + '"style="top:' + top + 'px; left:' + left + 'px;"></div>'; 
			
        }    
		
		ret += '</div>'     
    }
    return ret;
}