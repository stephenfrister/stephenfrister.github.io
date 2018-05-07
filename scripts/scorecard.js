 
var config = {
  apiKey: "AIzaSyAGjcDRlJDcaUlhRd_05so6EUI8qbvikYI",
  authDomain: "legistar-seattle.firebaseapp.com",
  databaseURL: "https://legistar-seattle.firebaseio.com",
};

firebase.initializeApp(config);

var zero = firebase.database().ref('votes/0');

var voteData = {}
var voteTypes = {}

function searchSubmit(){
     
    sendZero()
    
    search = document.getElementById('id-search-field').innerText;
    
    //CB 119123
    //CB 119215
    //CB 119130
    //CF 312905
    
    // cb -> CB
    // cf -> CF
    // appt -> Appt
    
    searchMatterFile( search )
    getVoteTypes()
    
}

function getVoteTypes() {
    voteTypesCount = Object.keys(voteTypes).length
    if( voteTypesCount <= 0 ){
        var firebaseVoteTypes = firebase.database().ref('/votes/votetypes')
        firebaseVoteTypes.once('value').then(function(snapshot) {
            snapshot.forEach(function(voteType) {
                voteTypes[voteType.key] = voteType.val()
            });
        });
    }
}

function displayInfo( row ) {
    
    document.getElementById('id-info').innerHTML = "";
    
    document.getElementById('id-info').innerHTML += "Body Name: " + voteData[row]["MatterHistoryActionBodyName"] + "<br>";
    voteTime = voteData[row]["MatterHistoryActionDate"].split("T")[0] + " @ " + voteData[row]["MatterHistoryActionDate"].split("T")[1]
    document.getElementById('id-info').innerHTML += "Date/Time: " + voteTime + "<br><br>";
    
    var newNo  = document.getElementById('id-vote-no'); 
    var newYes = document.getElementById('id-vote-yes'); 
    var newUnk = document.getElementById('id-vote-unknown'); 
        
    for(item in voteData[row]){
        if(!item.startsWith("Matter")){
            name = document.getElementById('id-person-' + item).innerText
            document.getElementById('id-info').innerHTML += "<div id='id-info-" + item + "'></div>"
            // In Favor 
            if ( voteData[row][item] == 16 ){    
                newImage = newYes.cloneNode(true)
                newImage.id = ( 'id-img-' + item )
                newImage.classList.remove('icon-hide')
                newImage.classList.remove('icon-large')
                newImage.classList.add('icon-small')
                document.getElementById( 'id-info-' + item ).appendChild(newImage); 
            }
            // Opposed 
            else if ( voteData[row][item] == 17 ){   
                newImage = newNo.cloneNode(true)
                newImage.id = ( 'id-img-' + item )
                newImage.classList.remove('icon-hide')
                newImage.classList.remove('icon-large')
                newImage.classList.add('icon-small')
                document.getElementById( 'id-info-' + item ).appendChild(newImage); 
            }
            // Others
            else {       
                newImage = newUnk.cloneNode(true)
                newImage.id = ( 'id-img-' + item )
                newImage.classList.remove('icon-hide')
                newImage.classList.remove('icon-large')
                newImage.classList.add('icon-small')
                document.getElementById( 'id-info-' + item ).appendChild(newImage); 
            
            }   
            nameVote = voteTypes[voteData[row][item]]
            document.getElementById('id-info-' + item ).innerHTML += "<span>" + name + " : " + nameVote + "</span><br>";
        }
    }
    document.getElementById('id-info').innerHTML += "<br>";
    document.getElementById('id-info').innerHTML += "Note: " + voteData[row]["MatterHistoryActionName"] + "<br>";
    document.getElementById('id-info').innerHTML += "Text: " + voteData[row]["MatterHistoryActionText"] + "<br>";
    
    
    /*
    
    img : Person 1 : In Favor
    img : Person 2 : In Favor
    img : Person 3 : Abstain
    img : Person 4 : Oppose
    
    */
    
    
}

function searchMatterFile( search ) {
    
    // clear data on new search
    voteData = {}
    
    console.log( "search: " + search )
    document.getElementById('id-results').innerHTML = "";
    document.getElementById('id-summary').innerHTML = "";
    document.getElementById('id-info').innerHTML = "";
    
    var matter = firebase.database().ref('/votes').orderByChild('MatterFile').equalTo(search)
    matter.once('value').then(function(snapshot) {
        
        voteTable = "";
        voteHeader = ""
        voteRows = []
        voteColumns = {}
        voteRecords = {}
        voteBody = {}
        
        matterStatus = ""
        matterEnact = ""
        
        snapshot.forEach(function(matterId) {
            
            voteHeader = matterId.child('MatterFile').val();
                    
            matterId.forEach(function(voteId) {
                    
                if(voteId.key == 'MatterEnactmentNumber'){
                    matterEnact = voteId.val()
                }
                if(voteId.key == 'MatterStatusName'){
                    matterStatus = voteId.val()
                }
                if( Number.isInteger( parseInt(voteId.key) ) ){
                    
                    voteDataCount = Object.keys(voteData).length
                    voteData[voteDataCount] = {}
                        
                    voteRows.push( voteId.child('MatterHistoryActionDate').val().split("T")[0] )
                    
                    voteId.forEach(function(voteInfo) {
                        
                        voteData[voteDataCount][voteInfo.key] = voteInfo.val()
                        
                        if( Number.isInteger( parseInt(voteInfo.key) ) ){
                            
                            mRow = voteRows.length - 1
                            mMember = voteInfo.key
                            mValue = voteInfo.val()
                            voteColumns[voteInfo.key] = "0"
                            voteRecords["td-" + mRow + "-" + mMember] = mValue
                        
                        }
                        else if( voteInfo.key.startsWith("Matter") ) {
                            
                            if(voteInfo.key == 'MatterHistoryActionBodyName'){
                                count = Object.keys(voteBody).length
                                voteBody[count] = voteInfo.val()
                            }
                        }
                        
                    });
                    
                }
                
            });
            
        });
        
        voteTable += '<table class="table table-header-rotated">'
        voteTable += '<thead>'
        voteTable += '<tr>'
        
        voteTable += '<th></th>'
        voteTable += '<th class="row-header font-caps">' + voteHeader + '</th>'
        
        for ( column in voteColumns ) {
            
            voteTable += '<th id="id-person-' + column + '" class="rotate-315"><div></div></th>'
            
            // get persons
            var person = firebase.database().ref('/votes/persons/' + column)
            person.once('value').then(function(snapshot) {
                name = snapshot.val() || '???';
                personDiv = 'id-person-' + snapshot.key
                document.getElementById(personDiv).innerHTML = '<div><span>' + name  + '</span><div>'
            });
            
        }
        
        voteTable += '</tr>'
        voteTable += '</thead>'
        voteTable += '<tbody>'
        
        for ( row in voteRows ) {
            voteTable += '<tr>'
            
            // new image...
            voteTable += '<td class="info-td" id="id-info-td-' + row + '" onclick="displayInfo(' + row + ')"></td>'
            
            voteTable += '<td class="font-caps">' + voteRows[row] + '</td>'
            
            for ( column in voteColumns ) {
                voteTable += '<td class="vote-td" id="td-' + row + "-" + column + '"></td>'
            }  
            voteTable += '<td class="font-long-small-caps">' + voteBody[row] + '</td>'
            
            voteTable += '</tr>'
        }
        
        voteTable += '</tbody>'
        voteTable += '</table>'
        
        document.getElementById('id-results').innerHTML = voteTable;
        
        var newNo  = document.getElementById('id-vote-no'); 
        var newYes = document.getElementById('id-vote-yes'); 
        var newUnk = document.getElementById('id-vote-unknown'); 
        var newInfo = document.getElementById('id-vote-info'); 
         
        for ( row in voteRows ){
            newImage = newInfo.cloneNode(true)
            newImage.id = ( 'id-img-info-td-' + row )
            newImage.classList.remove('icon-hide')
            document.getElementById( 'id-info-td-' + row ).appendChild(newImage); 
        }
        
        for ( vote in voteRecords ){
            
            // In Favor 
            if ( voteRecords[vote] == 16 ){    
                newImage = newYes.cloneNode(true)
                newImage.id = ( 'id-img-' + vote )
                newImage.classList.remove('icon-hide')
                document.getElementById( vote ).appendChild(newImage); 
            }
            // Opposed 
            else if ( voteRecords[vote] == 17 ){   
                newImage = newNo.cloneNode(true)
                newImage.id = ( 'id-img-' + vote )
                newImage.classList.remove('icon-hide')   
                document.getElementById( vote ).appendChild(newImage); 
            }
            // Others
            else {       
                newImage = newUnk.cloneNode(true)
                newImage.id = ( 'id-img-' + vote )
                newImage.classList.remove('icon-hide')   
                document.getElementById( vote ).appendChild(newImage); 
            
            }   
        }
        
        document.getElementById('id-summary').innerHTML += "Status: " + matterStatus + "<br>";
        document.getElementById('id-summary').innerHTML += "Enactment: " + matterEnact;
        
    });
    
}





function sendZero()
{
	zero.transaction(function (current_value) {
		return (current_value || 0) + 1; 
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