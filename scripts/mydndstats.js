

$(window).on("load", function () {
      var $this = $("input[data-type='exp']");
      var num = $this.val().replace(/,/gi, "");
      var num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
      $this.val(num2);
});

$(document).ready( function(){
    
    $("input[data-type='exp']").on('keyup keypress blur change', function(event){        
        // skip for arrow keys
        if(event.which >= 37 && event.which <= 40){
            event.preventDefault();
        }      
        var $this = $(this);
        var num = $this.val().replace(/,/gi, "");
        num = num.replace(/\D/g,'');
        var num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
        $this.val(num2);      
    });
    
    $("input[data-type='name']").on('keyup keypress blur change', function(event){
        var $this = $(this);
        var txt = $this.val()
        txt = txt.replace(/[^a-zA-Z\d\s:]/gi,'');
        $this.val(txt);      
    });
    
});

$(document).ready( function(){
    
    $(".statVal").on('keyup', function(event){
        if (event.which === 13 ) {
            $(this).blur();
        }
    });
    
    $(".statVal").on('blur change', function(event){
        saveStatsCurrent()
    });

    $("input[data-type='1t30']").on('blur change', function(event){ 
        var $this = $(this); 
        num = $this.val()     
        if ( isNaN(num) || num > 30 || num < 1 ){
            $this.val("")
        }
    });
    
    $("input[data-type='1t500']").on('blur change', function(event){ 
        var $this = $(this); 
        num = $this.val()     
        if ( isNaN(num) || num > 500 || num < 1 ){
            $this.val("")
        }
    });
    
});


function loadStatsCurrent(){
    
    var cookie = getCookie("current")
    
    if(cookie){
        
        var url = new URL("http://www.example.com/t.html?" + cookie);
        
        document.getElementById('stat-Name').value = url.searchParams.get("Name");
        document.getElementById('stat-Cls').value = url.searchParams.get("Cls");
        document.getElementById('stat-Lvl').value = url.searchParams.get("Lvl");
        document.getElementById('stat-Exp').value = url.searchParams.get("Exp");
        
        document.getElementById('stat-Str').value = url.searchParams.get("Str");
        document.getElementById('stat-Dex').value = url.searchParams.get("Dex");
        document.getElementById('stat-Con').value = url.searchParams.get("Con");
        document.getElementById('stat-Int').value = url.searchParams.get("Int");
        document.getElementById('stat-Wis').value = url.searchParams.get("Wis");
        document.getElementById('stat-Cha').value = url.searchParams.get("Cha");
        
        document.getElementById('stat-Ac').value = url.searchParams.get("Ac");
        document.getElementById('stat-Hp').value = url.searchParams.get("Hp");
        
        var statVals = document.querySelectorAll(".statVal")
        statVals.forEach( function(val){
            nVal = val.name;
            sVal = val.value;
            if(sVal === '0'){
                document.getElementById('stat-' + nVal).value = ""
            }
        })
        
        saveStatsCurrent() 
    }
    else {
        document.getElementById('stat-Cls').value = ""
    }
    
}

function refreshSavedFiles(){
    
    var mHistory = document.getElementById("idHistoryCollection")
    mHistory.innerHTML = "<div class='divHistory'>Saved Files:</div><br>";
    
    var cookies = getAllCookies()
    cookies.reverse().forEach( function(cookie){
        
        // cookie is empty, or current is the only state
        if ( !cookie || ( cookies.length == 1 && cookie.trim().startsWith("current") ) ) {
            mHistory.innerHTML += "<div class='divHistoryItemNone'>None</div>"
        }     
        else if( !cookie.trim().startsWith("current") ){ // skips "current"
            
            var cookieId = parseInt( cookie.substring( 0, cookie.indexOf("=") ) );
            var cookieVals = cookie.substring( cookie.indexOf("=") + 1, cookie.length );
            
            var url = new URL("http://www.example.com/t.html?" + cookieVals);
            var Lvl = url.searchParams.get("Lvl");
            var Name = url.searchParams.get("Name");
            var Cls = url.searchParams.get("Cls");
            
            if(Cls == 0){
                Cls = "Unknown"
            }
            if(Name == 0){
                Name = "???"
            }
            
            var cookTime = new Date(cookieId);
            var year = cookTime.getFullYear();
            var month = convertMonth( cookTime.getMonth() )
            var day = cookTime.getDate()
            var nth = getNth(day)
            var time = formatAMPM(cookTime)
            
            var historyString = ""
            historyString += "<div class='divHistoryItem'>"
            historyString += "Level " + Lvl + " " + Cls + ", " + Name + "<br>" 
            //historyString += "<hr style='height:5pt; visibility:hidden;' />"
            
            historyString += "<div class='divHistoryDate'>" + year + ", " + month + " " + day + nth + " @ " + time + "</div>"
            
            historyString += "<div>"
            historyString += "<a class='buttonStyle noselect button-delete' title='Delete File'>"
            historyString += "<i class='material-icons' onclick='deleteSaveFile(" + cookieId + ")'>delete</i>"
            historyString += "</a>"
            historyString += "</div>"    
            
            historyString += "<div>"
            historyString += "<a class='buttonStyle noselect button-launch' title='Open File'>"
            historyString += "<i class='material-icons' onclick='loadSaveFile(" + cookieId + ")'>launch</i>"
            historyString += "</a>"
            historyString += "</div>"
            
            historyString += "</div>"
            
            mHistory.innerHTML += historyString
        }
    })
    
}


function loadSaveFile( cId ) {
    
    // save current as cookie with new timestamp
    saveStatsNew()
    
    // retrieve cookie file and save as current
    loadCookie = getCookie( cId )
    setCookie("current", loadCookie, 1111)
    
    // load the file that was just saved
    loadStatsCurrent()
    
    // delete old file
    deleteSaveFile( cId ) 
    
    // refresh UI
    refreshSavedFiles()
    
}

function deleteSaveFile( cookieId ) {
    deleteCookie( cookieId )
    refreshSavedFiles()
}

function saveStatsCurrent() {
    
    var stats = generateStatString()
    setCookie("current", stats, 1111)
    
    var d = new Date();
    var t = d.getTime();
    
    var mUpdated = document.getElementById("idUpdated")
    
    var currTime = new Date();
    var year = currTime.getFullYear();
    var month = convertMonth( currTime.getMonth() )
    var day = currTime.getDate()
    var nth = getNth(day)
    var time = formatAMPM(currTime)
    
    var updatedString = ""
    updatedString += year + ", " + month + " " + day + nth + " @ " + time
    
    mUpdated.innerHTML = updatedString
    
}

function deleteStatsCurrent() {
    
    var statVals = document.querySelectorAll(".statVal")
    var statString = ""
    
    statVals.forEach( function(val){
        val.value = 0
        sVal = 0
        nVal = val.name;
        statString += nVal + "=" + sVal + "&"
    })
    
    setCookie("current", generateStatString(), 1111)
    location.reload();
}

function saveStatsNew() {
    
    var d = new Date();
    var t = d.getTime();
    var stats = generateStatString()
    var saves = getAllCookies()
    
    var hasData = false
    var url = new URL("http://www.example.com/t.html?" + stats);
    url.searchParams.forEach( function(value, key){
        //console.log(value, key);
        if (value != '0'){
            hasData = true
        }
    });
    
    // if not empty 
    if( hasData ) {
        setCookie(t, stats, 1111)
        refreshSavedFiles()
    }
}

function checkIfDuplicate() {
    
    var stats = generateStatString()
    var saves = getAllCookies()
    
    var isDuplicate = '0'
    saves.forEach( function(save){
        var saveId = parseInt( save.substring( 0, save.indexOf("=") ) );
        var saveVals = save.substring( save.indexOf("=") + 1, save.length );
        
        if( stats === saveVals ){
            isDuplicate = saveId
        }
        
    })
    
    if( isDuplicate ){
        
        // set as current
        saveStatsCurrent()
        
        // delete duplicate
        deleteSaveFile( isDuplicate )
    }
    
}

function generateStatString() {
    
    var statVals = document.querySelectorAll(".statVal")
    var statString = ""
    
    statVals.forEach( function(val){
        nVal = val.name;
        sVal = val.value;
        if(!sVal){
            sVal = 0
        }
        statString += nVal + "=" + sVal + "&"
    })
    
    statString = statString.slice(0,-1)
    statString = encodeURI(statString);
    
    return statString
    
}

function readStatsUrl() {
    
    //console.log("window.location.href: " + window.location.href )
    //console.log("window.location.origin: " + window.location.origin )
    //console.log("window.location.pathname: " + window.location.pathname )
    
    currentUrl = window.location.href
    defaultUrl = window.location.origin + window.location.pathname
    
    if ( currentUrl != defaultUrl ){
        
        window.location.href = window.location.origin + window.location.pathname
        
        var mUrl = window.location.href
        updateStatsWithUrl( mUrl )
    }
    
}

function updateStatsWithUrl( mUrl ) {
    
    var urlStats = mUrl.split('?', 2 )
        
    if( urlStats[1] && ( urlStats[1] != generateStatString() ) ) {
        
        // save current as cookie with new timestamp
        saveStatsNew()        
        
        // set data passed in as current stats 
        setCookie("current", urlStats[1], 1111)  
        
        // load the file that was just saved
        loadStatsCurrent()        
        
        // if entry is duplicate delete second entry
        checkIfDuplicate()        
        
        // refresh UI
        refreshSavedFiles()
    }
}


function exportLink() {
    //var mExport = "https://mydndstats.web.app?" + generateStatString()
    var mExport = window.location.origin + window.location.pathname + generateStatString()
    navigator.clipboard.writeText( mExport )
        .then(() => { window.prompt( "Link:", mExport ) })
        .catch((error) => { alert( "Copy failed. " + error ) })
}

function importLink() {    
    // prompt user for a link
    var userEntry = prompt("Enter Link:", "");    
    // check if the user selected cancel
    if ( userEntry != null ) {        
        console.log( "userEntry: " + userEntry )        
        updateStatsWithUrl( userEntry )         
    }    
}

function exportFile() {
    
    var statString = generateStatString()
    var url = new URL("http://www.example.com/t.html?" + statString);
    document.getElementById('stat-Name').value = url.searchParams.get("Name");
    
    fileName =  url.searchParams.get("Name") + "-Lvl-" 
    fileName += url.searchParams.get("Lvl") + "-"
    fileName += url.searchParams.get("Cls") + ".txt"
    
    var fileContent = ""
    fileContent = statString.replaceAll("=", ": ").replaceAll("&","\n" )
    
    var blob = new Blob( [fileContent], { type: "text/plain;charset=utf-8" } );
    saveAs( blob, fileName );
    
}

function importFile() {

    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 

        // getting the file reference
        var file = e.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // when done reading
        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            content = "?" + content.replaceAll(": ","=").replaceAll("\n","&").trim()
            updateStatsWithUrl( content )
        }

    }
    input.click();
}

window.onload=function(){

    let dropArea = document.getElementById("drop-area")
    
    // Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)   
        document.body.addEventListener(eventName, preventDefaults, false)
    })

    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    })

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false)
    
    function preventDefaults (e) {
        e.preventDefault()
        e.stopPropagation()
    }

    function highlight(e) {
        dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight')
    }

    function handleDrop(e) {
        var dt = e.dataTransfer
        var files = dt.files

        handleFiles(files)
    }
    function handleFiles(files) {
        files = [...files]
        files.forEach(uploadFile)
    }
    function uploadFile(file, i) {

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // when done reading
        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            content = "?" + content.replaceAll(": ","=").replaceAll("\n","&").trim()
            updateStatsWithUrl( content )
        }
        
    }

}



function importCode() {
    console.log("importCode...")
}

function exportCode() {
    console.log("exportCode...")
}



/////////////////////////
// Date Time Functions //
/////////////////////////

function getNth(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }   
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds(); 
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds; 
    var strTime = hours + ':' + minutes + '.' + seconds + '' + ampm;
    return strTime;
}

function convertMonth(month) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month];
}



//////////////////////
// Cookie Functions //
//////////////////////

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function getAllCookies() {
    var cookies = document.cookie.split(";");
    return cookies
}


































