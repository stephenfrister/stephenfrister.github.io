
var config = {
    apiKey: "AIzaSyAGjcDRlJDcaUlhRd_05so6EUI8qbvikYI",
    authDomain: "legistar-seattle.firebaseapp.com",
    databaseURL: "https://legistar-seattle.firebaseio.com",
    projectId: "legistar-seattle",
    storageBucket: "legistar-seattle.appspot.com",
    messagingSenderId: "789794300253"
};

firebase.initializeApp(config);

//var index = firebase.database().ref('index');

function searchSubmit(){
    
    // http://webapi.legistar.com/v1/Seattle/matters/1796/Texts/1897
    // http://webapi.legistar.com/v1/Seattle/matters/<?1>/Texts/<?2>
    // http://webapi.legistar.com/v1/Seattle/matters/<matterId>/Texts/<textId>
    // legistar:    index/search/<key>/<value>
    // matterId:    <value>
    // textId:      <key>
    // http://webapi.legistar.com/v1/Seattle/matters/<value>/Texts/<key>
    
    //console.log( "submit... " + i )
    //i++; 
    
    value = ""; 
    value = document.getElementById('id-search-field').innerHTML;
    
    document.getElementById('id-results').innerHTML = "";
    
    //var searchTerm = 'police'; 
    var searchTerm = value;
    var searchIndex = 'index/' +  searchTerm;
    
    console.log("searchIndex: " + searchIndex);

    //console.log("here.. " + window.innerWidth);
    
    var search = firebase.database().ref(searchIndex);
    search.once('value').then(function(snapshot) {
        var data = snapshot.val();
        
        //console.log( "index... " + i )
        //console.log( "data: " + data )
        
        rValue = []; 
        
        if(data) { 
        
            Object.keys(data).forEach(function(key) {
                
                //console.log(key, data[key]);
                
                mKey = key;
                mValue = data[key];
                mLink = "http://webapi.legistar.com/v1/Seattle/matters/" + mValue + "/Texts/" + mKey;
                
                //console.log(mLink);
                
                //rValue += "Link: " + mLink + "<br>";
                //rValue.push("Link: " + mLink + "<br>");
                
                mTemp = "<div>MatterId: <b>" + mValue + "</b>, TextId: <b>" + mKey + "</b>:";
                //mTemp += "&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>";
                
                

                var test = window.innerWidth
                console.log("test.. " + test );
                
                //if (true) {
                if (parseInt(test) < parseInt(700) ) {
                    console.log("less.. " );
                    mTemp += "<br>&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>";
                }
                else {
                    console.log("greater.. " );
                    mTemp += "&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>";
                }
                /**/
                
                
                rValue.push( mTemp );
                
                //rValue.push("<div>MatterId: <b>" + mValue + "</b>, TextId: <b>" + mKey + "</b>:&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>");
                
            });
            
            rValue.reverse(); 
            //rValue = rValue.join("<br>"); 
            rValue = rValue.join(" "); 
            
            //<a href="url">link text</a>
            
            //mResults = ""; 
            //for mLink in rValue {
                
                //mResults += "<div><a href=" +  + ">" + ... + "</a><div>"
                //mResults += "<a href=" + mLink + ">" + mLink + "</a>"
                
                //rValue = rValue.join(" "); 

            //}            
            
            
            //document.getElementById('id-results').innerHTML += "Link: " + mLink + "<br>";
            document.getElementById('id-results').innerHTML += rValue;
        
        }
        
    });
    /* */
    
}

document.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
    if( e.keyCode == 13 ) {
        e.preventDefault()
        searchSubmit()
    }
}


