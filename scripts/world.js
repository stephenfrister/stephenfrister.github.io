
var ping = new Firebase('https://github-website-sgf.firebaseio.com/ping');
var goblins = new Firebase('https://github-website-sgf.firebaseio.com/goblins');
var minerals = new Firebase('https://github-website-sgf.firebaseio.com/minerals');
var construction = new Firebase('https://github-website-sgf.firebaseio.com/construction');

var world = new Firebase('https://github-website-sgf.firebaseio.com/world1'); 
var worldMap = new Firebase('https://github-website-sgf.firebaseio.com/world1/map'); 

function pushMap()
{
	var grid = 
	[
"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwcc",
"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwcc",
"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwc",
"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
"wwwwwwwwwwwwwwwwwwwwwwpswwwwwwwwwwwww",
"wwwwwwwwwwwwwpwwwwwwwwspdppdwwdmwwmwc",
"wwwwwtpfwwwwppwwpwwpsfwwpppppppmmmmmc",
"wwwwwpfppwwwppdffwwssswwpfffppsmmmmcc",
"wwwwwffpfffpfffppdwppdppppppdsmmmmccc",
"wwwwpppmfppppddpfswmpppfpppppmmmmcccc",
"wwwwfddsmdpfpppppsmmdppppdpfpmmmccccc",
"wwwwfdpmmmdfmfwwpfmmmfpfpppmmmmcccccc",
"wwwwwpsmmfffffwwfppmmppdpppmmmmcccccc",
"wwwwwmmmsffpfpffpfmmwwwwdwpmmmccccccc",
"wwwwpmmfffpffffppmmmwwpwwwfpmmccccccc",
"wwwwpmfpppfppppfpmmffppffpffmmccccccc",
"wwwwwsfppfpppfpffmmfpppffffmmmccccccc",
"wwwwwwpffpsddmfpmmmpfffffffmmmccccccc",
"wwwwwwpfppsddmppmfmfffffffffmmccccccc",
"wwwwwwffspssspfmffmfpfmmmfffmmccccccc",
"wwwwwwffpffppmpmfmmpfmfmfffmmmccccccc",
"wwwwwppfppfpmmpppmmffmmfpffmmcccccccc",
"wwwwpfpdpfpfmmfmmfmmfmmmfffmmcccccccc",
"wwwwwfddppfmfppfpmmfmffmfffmmmccccccc",
"wwwpppdfpsfmmdppmmmfpfmmfffmmmccccccc",
"wwwwwwwpspdmdfmfmfwmmmmmmmfmmcccccccc",
"wwwwddwwdpwwwffpmmmmwwwwwmfmmcccccccc",
"wwwppppwwwwfwwpfpmmwwmmwwmfmmmccccccc",
"wwwpwdddpppddwwpfmmwffmmmmfmmmccccccc",
"wwwpddpddpfdddwwffmwsmmmmmfmmmccccccc",
"wwwwpdpdpfdddddwwwwwmmfffffmmmccccccc",
"wwwpdpdpfdfpdddwfpmmmffffffmmcccccccc",
"wwwwdpdpppppdddwpdmmmfffffmmmcccccccc",
"wwwwwwwdfddpdddwpdmmfffwwfmmmcccccccc",
"wwwwwwwddddddddwwpmmffpwwfmmmcccccccc",
"wwwwwwwdddddddddwpmmffppffmmmmccccccc",
"wwwwwwwdddddddddwwmmfffffmmmmmccccccc",
"wwwwwwwddddpddddwwfmfffffmmmmmccccccc",
"wwwwwwwddddpppwwwwwmmmmfmmmmmmccccccc",
"wwwwwwwddddpwwwwwwwmmfmmmmmmmmccccccc",
"wwwwwwwppppppwwwfwwwwwwsmmmmmmccccccc",
"wwwwwwwddddppdwwwwfmfmsmmmmmmcccccccc",
"wwwwwwwdppffpdwwwmpmmmmfmmmmmcccccccc",
"wwwwwwwdppdfddwmmmmmffmmmmmcccccccccc",
"wwwwwwwdddddddwmmmmmffmmmmmcccccccccc",
"wwwwwwwdddddddwmmmmmffmmmmmcccccccccc",
"wwwwwwwdddddddwmmmmmmmmmmmmcccccccccc",
"wwwwwwwdmmmmpwwmmmmmmmmmmmmcccccccccc",
"wwwwwwwmmmmwwwwmmmwmmmmmmmccccccccccc",
"wwwwwwmmmmmwmmwmmmmmmmmmmcccccccccccc",
"wwwwwmmmmmmwmmmmmmmmmmmmmcccccccccccc",
"wwwmmmmmmmmmmmmmmmmmmmmmccccccccccccc",
"wwwwwmmmmmmmmwmmmmmcccccccccccccccccc",
"wwwwwwmmmmmmmmmmmmmcccccccccccccccccc",
"wwwwwwmmmmmmmmmmmmccccccccccccccccccc",
"cwwwwpmmccmmccmmmcccccccccccccccccccc",
"ccwwccccccccccccccccccccccccccccccccc"
	]
	//	
	world.set({
		map : grid
	});
	
}

function makeWorld( col, row )
{
    var objWorld = document.getElementById("worldDiv");
	var objMap = document.getElementById("moveDiv");
    //obj.innerHTML = makeGrid( row, col );
	
    objWorld.innerHTML = accessWorldMap(3,2);
	objMap.innerHTML = accessMoveMap(0,0); 
	
	if(objWorld.innerHTML == "undefined")
	{
		objWorld.innerHTML = "</br><center>Loading...</center>";
	}		
	if(objMap.innerHTML == "undefined")
	{
		objMap.innerHTML = "</br><center>Loading...</center>";
	}
	
	// else
	// {
		// //objWorld.innerHTML = "Done.";	
	// }
}

function accessMoveMap( moveRow, moveCol )
{
	var objMap = document.getElementById("moveDiv");
	
	var array;    
	
	var colSpace = 17;
	var rowSpace = 17;
	
	var rowOffset = 0; 
	var colOffset = 8;
	
	var rowStart = 0;
	var colStart = 0; 	
	
	var top = 0; 
	var left = 0; 
	
	var rowMin = moveRow;
	var colMin = moveCol;
	var rowMax = rowMin + 8;
	var colMax = colMin + 8; 	
	
		objMap.innerHTML = "";
		for ( var r = 0; (r < array.length) & (r < rowMax) ; r++ )
		{			
			for ( var c = 0; (c < array[r].length) & (c < colMax) ; c++ )
			{					
				if((r+rowMin)%2 == 0)
				{
					top = r * rowSpace + rowStart - rowMin * rowSpace; 
					left = c * colSpace + colStart - colMin * colSpace; 
				}
				else
				{
					top = r * rowSpace + rowStart + rowOffset - rowMin * rowSpace;   
					left = c * colSpace + colStart + colOffset - colMin * colSpace; 
				}
				
				objMap.innerHTML += '<div class="hex hex-water" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
			}
		}
	
}

function accessWorldMap( moveRow, moveCol )
{		
	var objWorld = document.getElementById("worldDiv");	
	var objMap = document.getElementById("moveDiv");
	
	//var test = ["1","2","3"];
	var array;    
	
	var colSpace = 17;
	var rowSpace = 17;
	
	var rowOffset = 0; 
	var colOffset = 8;
	
	var rowStart = 0;
	var colStart = 0; 	
	
	var top = 0; 
	var left = 0; 
	
	var rowMin = moveRow;
	var colMin = moveCol;
	var rowMax = rowMin + 8;
	var colMax = colMin + 8; 
	
	worldMap.once("value", function(snapshot) {
		
		array = snapshot.val();
		
		objWorld.innerHTML = "";
		objMap.innerHTML = "";
		
		for ( var r = rowMin+2; (r < array.length) & (r < rowMax-3) ; r++ )
		{			
			for ( var c = colMin+2; (c < array[r].length) & (c < colMax-3) ; c++ )
			{					
				if((r+rowMin)%2 == 0)
				{
					top = r * rowSpace + rowStart - rowMin * rowSpace; 
					left = c * colSpace + colStart - colMin * colSpace; 
				}
				else
				{
					top = r * rowSpace + rowStart + rowOffset - rowMin * rowSpace;   
					left = c * colSpace + colStart + colOffset - colMin * colSpace; 
				}
				
				//1 - empty
				if ( r == rowMin+2 && c == colMin+2)
				{
					// do nothing
				}
				//2 - up left 
				//3 - up right 
				
				//4 - left 
				//5 - empty
				else if ( r == rowMin+3 && c == colMin+3)
				{
					// do nothing
				}
				//6 - right 
				
				//7 - empty
				else if ( r == rowMin+4 && c == colMin+2)
				{
					// do nothing
				}
				//8 - down left 
				//9 - down right 
				
				else 
				{					
					objMap.innerHTML += '<div class="hex hex-swamp" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
			}
		}
		
		for ( var r = rowMin; (r < array.length) & (r < rowMax) ; r++ )
		{			
			for ( var c = colMin; (c < array[r].length) & (c < colMax) ; c++ )
			{					
				if((r+rowMin)%2 == 0)
				{
					top = r * rowSpace + rowStart - rowMin * rowSpace; 
					left = c * colSpace + colStart - colMin * colSpace; 
				}
				else
				{
					top = r * rowSpace + rowStart + rowOffset - rowMin * rowSpace;   
					left = c * colSpace + colStart + colOffset - colMin * colSpace; 
				}
				
				//hex-water 	w	water
				if ( array[r].charAt(c) == 'w')
				{
					objWorld.innerHTML += '<div class="hex hex-water" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-town		t	town
				if ( array[r].charAt(c) == 't')
				{
					objWorld.innerHTML += '<div class="hex hex-town" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-plains	p	plains
				if ( array[r].charAt(c) == 'p')
				{
					objWorld.innerHTML += '<div class="hex hex-plains" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-forest	f	forest
				if ( array[r].charAt(c) == 'f')
				{
					objWorld.innerHTML += '<div class="hex hex-forest" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-mountain	m	mountain
				if ( array[r].charAt(c) == 'm')
				{
					objWorld.innerHTML += '<div class="hex hex-mountain" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-swamp		s	swamp
				if ( array[r].charAt(c) == 's')
				{
					objWorld.innerHTML += '<div class="hex hex-swamp" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-desert	d	desert
				if ( array[r].charAt(c) == 'd')
				{
					objWorld.innerHTML += '<div class="hex hex-desert" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-clouds	c	cloud
				if ( array[r].charAt(c) == 'c')
				{
					objWorld.innerHTML += '<div class="hex hex-cloud" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}

			}
			
		}
		
	});
	
}








































