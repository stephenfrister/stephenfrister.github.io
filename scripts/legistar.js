
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
    
    document.getElementById('id-results').innerHTML = "";
    document.getElementById('id-words-found').innerHTML = ": "; 
    document.getElementById('id-words-not-found').innerHTML = ": "; 
    document.getElementById('id-words-removed').innerHTML = ": "; 
    document.getElementById('id-results-combined').innerHTML = "";
    
    // http://webapi.legistar.com/v1/Seattle/matters/1796/Texts/1897
    // http://webapi.legistar.com/v1/Seattle/matters/<matterId>/Texts/<textId>
    
    // legistar:    index/search/<key>/<value>
    // matterId:    <value>
    // textId:      <key>
    
    // http://webapi.legistar.com/v1/Seattle/matters/<value>/Texts/<key>
    
    value = ""; 
    value = document.getElementById('id-search-field').innerText;
    
    var searchWords = value.toLowerCase().replace(/\W/g, ' ');
    var mWords =  searchWords.split(" ")
    
    ////
    //  replace "." with ","
    //  searchWords = searchWords.replace(".", ",")
    ////
    
    ////
    //  remove words not indexed
    ////
    
    exList = [  
            'and', 'for', 'new', 'par', 'the',
            'who', 'per', 'now', 'not', 'its',
            'has', 'few', 'day', 'but', 'may',
            'tab', 'are', 'any', 'was', 'use',
            'ansi', 'body', 'city', 'open', 'that',
            'were', 'this', 'them', 'bill', 'more',
            'less', 'page', 'many', 'each', 'last',
            'take', 'next', 'with', 'such', 'will',
            'upon',
            'times', 'title', 'roman', 'where', 'there',
            'shall', 'which', 'after', 'these', 'those',
            'should', 'signed', 'within', 'before',
            'seattle', 'council', 'through', 'thereof',
            'whereas',
            'therefore', 'therewith'         
            ]
            
    var listLength = mWords.length;
    for ( var item in mWords ) {
        if ( exList.indexOf(mWords[item]) > -1 ) {
            console.log("remove item: " + mWords[item]);
            document.getElementById('id-words-removed').innerHTML += mWords[item] + ", "
            listLength = listLength - 1; 
        }
    }
    
    // for each item in mWords
    // get all database entries
    for ( var item in mWords ) {
        
        if ( !(exList.indexOf(mWords[item]) > -1) ) {
            console.log("item: " + mWords[item]);
            getSearchResults( mWords[item], listLength );
        }
        
    }
    
    // add them to a list
    // document.getElementById('id-results-combined').innerHTML
    //.. 
    
    // remove any entry that doesn't have count == len(mWords)
    // maybe count instead? 
    //.. 
    
    // return those to the user
    // set document.getElementById('id-results').innerHTML
    //.. 
    //document.getElementById('id-results').innerHTML = "<div>(" + mWords.length + ")</div>"
    
}

function update( count ) {
    var combinedResults = document.getElementById('id-results-combined').innerHTML;
    mSplit = combinedResults.split('(');
    for ( var line in mSplit ) {
        if ( mSplit[line].startsWith(count) ) {
             document.getElementById('id-results').innerHTML += mSplit[line].split(")")[1];
        }
    }
}

function getSearchResults( word, searchLength ) {
    
    var searchIndex = 'index/' +  word;
    var search = firebase.database().ref(searchIndex);
    
    search.once('value').then(function(snapshot) {
        var data = snapshot.val();
        
        rValue = []; 
        
        if(data) { 
        
            var combinedResults = document.getElementById('id-results-combined').innerHTML
        
            Object.keys(data).forEach(function(key) {
                
                mKey = key;
                mValue = data[key];
                
                mLink = "http://webapi.legistar.com/v1/Seattle/matters/" + mValue + "/Texts/" + mKey;
                
                mTemp  = ""
                mTemp  = "MatterId: <b>" + mValue
                mTemp += "</b>, TextId: <b>" + mKey;
                mTemp += "</b>:";
                
                var re = new RegExp(mTemp, 'g');
                var count = (combinedResults.match(re) || []).length + 1;
                
                mTemp = "<div>(" + count + ".) " + mTemp
                
                if (window.innerWidth < 700 ) {
                    mTemp += "<br>&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a></div>";
                }
                else {
                    mTemp += "&nbsp;&nbsp;<a href=" + mLink + ">" + mLink + "</a></div>";
                }
                rValue.push( mTemp );
                
            });
            
            rValue.reverse(); 
            rValue = rValue.join(" "); 
            
            document.getElementById('id-results-combined').innerHTML += rValue;
            
            document.getElementById('id-words-found').innerHTML += word + ", ";
            
            update( searchLength ); 
        
        }
        else { 
            document.getElementById('id-words-not-found').innerHTML += word + ", ";
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

document.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = e.clipboardData.getData("text/plain");

    // insert text manually
    document.execCommand("insertHTML", false, text);
});


