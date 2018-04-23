
var config = {
    apiKey: "AIzaSyAGjcDRlJDcaUlhRd_05so6EUI8qbvikYI",
    authDomain: "legistar-seattle.firebaseapp.com",
    databaseURL: "https://legistar-seattle.firebaseio.com",
    projectId: "legistar-seattle",
    storageBucket: "legistar-seattle.appspot.com",
    messagingSenderId: "789794300253"
};

firebase.initializeApp(config);

function searchSubmit(){
    
    // http://webapi.legistar.com/v1/Seattle/matters/1796/Texts/1897
    // http://webapi.legistar.com/v1/Seattle/matters/<matterId>/Texts/<textId>
    
    // legistar:    index/search/<key>/<value>
    // matterId:    <value>
    // textId:      <key>
    
    // http://webapi.legistar.com/v1/Seattle/matters/<value>/Texts/<key>
    
    value = ""; 
    value = document.getElementById('id-search-field').innerHTML;
    
    document.getElementById('id-results').innerHTML = "";
    
    var searchTerm = value;
    var searchIndex = 'index/' +  searchTerm;
    
    console.log("searchIndex: " + searchIndex);
    
    var search = firebase.database().ref(searchIndex);
    search.once('value').then(function(snapshot) {
        var data = snapshot.val();
        
        rValue = []; 
        
        if(data) { 
        
            Object.keys(data).forEach(function(key) {
                
                //console.log(key, data[key]);
                
                mKey = key;
                mValue = data[key];
                mLink = "http://webapi.legistar.com/v1/Seattle/matters/" + mValue + "/Texts/" + mKey;
                
                
                mTemp = "<div>MatterId: <b>" + mValue + "</b>, TextId: <b>" + mKey + "</b>:";
                //mTemp += "&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>";
                
                if (parseInt(test) < parseInt(700) ) {
                    mTemp += "<br>&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>";
                }
                else {
                    mTemp += "&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>";
                }
                /**/
                
                rValue.push( mTemp );
                
                //rValue.push("<div>MatterId: <b>" + mValue + "</b>, TextId: <b>" + mKey + "</b>:&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a><div>");
                
            });
            
            rValue.reverse(); 
            rValue = rValue.join(" "); 
            
            document.getElementById('id-results').innerHTML += rValue;
        
        }
    });
    
}

document.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
    if( e.keyCode == 13 ) {
        e.preventDefault()
        searchSubmit()
    }
}


