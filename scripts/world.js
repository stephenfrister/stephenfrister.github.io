
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
"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
"wwwwwwwwwwwwwwwwwwwwpswwwwwwwwwwwww",
"wwwwwwwwwwwpwwwwwwwwspdppdwwdmwwmwc",
"wwwtpfwwwwppwwpwwpsfwwpppppppmmmmmc",
"wwwpfppwwwppdffwwssswwpfffppsmmmmcc",
"wwwffpfffpfffppdwppdppppppdsmmmmccc",
"wwpppmfppppddpfswmpppfpppppmmmmcccc",
"wwfddsmdpfpppppsmmdppppdpfpmmmccccc",
"wwfdpmmmdfmfwwpfmmmfpfpppmmmmcccccc",
"wwwpsmmfffffwwfppmmppdpppmmmmcccccc",
"wwwmmmsffpfpffpfmmwwwwdwpmmmccccccc",
"wwpmmfffpffffppmmmwwpwwwfpmmccccccc",
"wwpmfpppfppppfpmmffppffpffmmccccccc",
"wwwsfppfpppfpffmmfpppffffmmmccccccc",
"wwwwpffpsddmfpmmmpfffffffmmmccccccc",
"wwwwpfppsddmppmfmfffffffffmmccccccc",
"wwwwffspssspfmffmfpfmmmfffmmccccccc",
"wwwwffpffppmpmfmmpfmfmfffmmmccccccc",
"wwwppfppfpmmpppmmffmmfpffmmcccccccc",
"wwpfpdpfpfmmfmmfmmfmmmfffmmcccccccc",
"wwwfddppfmfppfpmmfmffmfffmmmccccccc",
"wpppdfpsfmmdppmmmfpfmmfffmmmccccccc",
"wwwwwpspdmdfmfmfwmmmmmmmfmmcccccccc",
"wwddwwdpwwwffpmmmmwwwwwmfmmcccccccc",
"wppppwwwwfwwpfpmmwwmmwwmfmmmccccccc",
"wpwdddpppddwwpfmmwffmmmmfmmmccccccc",
"wpddpddpfdddwwffmwsmmmmmfmmmccccccc",
"wwpdpdpfdddddwwwwwmmfffffmmmccccccc",
"wpdpdpfdfpdddwfpmmmffffffmmcccccccc",
"wwdpdpppppdddwpdmmmfffffmmmcccccccc",
"wwwwwdfddpdddwpdmmfffwwfmmmcccccccc",
"wwwwwddddddddwwpmmffpwwfmmmcccccccc",
"wwwwwdddddddddwpmmffppffmmmmccccccc",
"wwwwwdddddddddwwmmfffffmmmmmccccccc",
"wwwwwddddpddddwwfmfffffwwmmmccccccc",
"wwwwwddddpppwwwwwmmmmfmwwwmmccccccc",
"wwwwwddddpwwwwwwwmmfmmmmwmmmccccccc",
"wwwwwppppppwwwfwwwwwwsmmmmmmccccccc",
"wwwwwddddppdwwwwfmfmsmmmmmmcccccccc",
"wwwwwdppffpdwwwmpmmmmfmmmmmcccccccc",
"wwwwwdppdfddwmmmmmffmmmmmcccccccccc",
"wwwwwdddddddwmmmmmffmmmmmcccccccccc",
"wwwwwdddddddwwwwmmffmmmmmcccccccccc",
"wwwwwdddddddwmmmmmmmmmmmmcccccccccc",
"wwwwwdmmmmpwwmmmmmmmmmmmmcccccccccc",
"wwwwwmmmmwwwwmmmwmmmmmmmccccccccccc",
"wwwwmmmmmwmmwmmmmmmmmmmcccccccccccc",
"wwwmmmmmwwmmwwmmmmmmmmmcccccccccccc",
"wmmmmmmmwmmmmmmmmmmmmmccccccccccccc",
"wwwmmmmmwmmwmmmmmcccccccccccccccccc",
"wwwwmmmmwmmmmmmmmcccccccccccccccccc",
"wwwwmmmmwmmmmmmmccccccccccccccccccc",
"wwwpmmccwmccmmmcccccccccccccccccccc",
"wwccccccccccccccccccccccccccccccccc",
"wcccccccccccccccccccccccccccccccccc"
	]
	//	
	world.set({
		map : grid
	});
	
}

function makeWorld( col, row )
{
    var obj = document.getElementById("worldDiv");
    //obj.innerHTML = makeGrid( row, col );
    obj.innerHTML = accessWorld();
	
	if(obj.innerHTML == "undefined")
	{
		obj.innerHTML = "</br><center>Loading...</center>";
	}
	// else
	// {
		// //obj.innerHTML = "Done.";		
	// }
}

function accessWorld()
{		
	var obj = document.getElementById("worldDiv");
	var test = ["1","2","3"];
	var array;    
	
	var colSpace = 17;
	var rowSpace = 17;
	
	var rowOffset = 0; 
	var colOffset = 8;
	
	var rowStart = 0;
	var colStart = 0; 	
	
	var top = 0; 
	var left = 0; 
	
	var rowMax = 8;
	var colMax = 8; 
	
	worldMap.once("value", function(snapshot) {
		
		array = snapshot.val();
		
		obj.innerHTML = "";
		//obj.innerHTML += "</br>length: " + array.length;
		//obj.innerHTML += "</br>";
		//for ( var r = 0; r < array.length ; r++ )
		for ( var r = 0; (r < array.length) & (r < rowMax) ; r++ )
		{			
			//obj.innerHTML += '<div class="hexColumn" id="Column'+(r+1)+'">';
			//for ( var c = 0; c < array[r].length ; c++ )
			for ( var c = 0; (c < array[r].length) & (c < colMax) ; c++ )
			{					
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
				
				//hex-water 	w	water
				if ( array[r].charAt(c) == 'w')
				{
					//obj.innerHTML += '<div class="hex hex-water"';
					obj.innerHTML += '<div class="hex hex-water" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-town		t	town
				if ( array[r].charAt(c) == 't')
				{
					obj.innerHTML += '<div class="hex hex-town" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-plains	p	plains
				if ( array[r].charAt(c) == 'p')
				{
					obj.innerHTML += '<div class="hex hex-plains" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-forest	f	forest
				if ( array[r].charAt(c) == 'f')
				{
					obj.innerHTML += '<div class="hex hex-forest" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-mountain	m	mountain
				if ( array[r].charAt(c) == 'm')
				{
					obj.innerHTML += '<div class="hex hex-mountain" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-swamp		s	swamp
				if ( array[r].charAt(c) == 's')
				{
					obj.innerHTML += '<div class="hex hex-swamp" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-desert	d	desert
				if ( array[r].charAt(c) == 'd')
				{
					obj.innerHTML += '<div class="hex hex-desert" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}
				//hex-clouds	c	cloud
				if ( array[r].charAt(c) == 'c')
				{
					obj.innerHTML += '<div class="hex hex-cloud" id="' + 'r:' + r + ',c:' + c + '" style="top:' + top + 'px; left:' + left + 'px;"></div>';
				}

			}
			//obj.innerHTML += '</br>';
			//obj.innerHTML += "</br>row[" + r + "]: " + array[r] + " , type: " + array[r].charAt(3);
			//obj.innerHTML += "</br>row[" + r + "]: " + array[r] + " , type: " + array[r].length;
			
			// obj.innerHTML += '</div>'  
		}		
		
		//obj.innerHTML = array;
	});
	
}








































