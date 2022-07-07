
// Client ID and API key from the Developer Console
var CLIENT_ID = '719481055905-l3u4qer8m5qsfmbkehr9qukfpmfpjj6a.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAmtbMCm4bylL27T280ZDJ8j9OXtXYNADI';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
// var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
// var SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
// var SCOPES = 'https://www.googleapis.com/auth/drive.file';
var SCOPES = 'https://www.googleapis.com/auth/drive';

// var SCOPE_READ = 'https://www.googleapis.com/auth/drive.readonly';
// var SCOPE_WRITE = 'https://www.googleapis.com/auth/drive.file';

// var SCOPES = 'https://www.googleapis.com/auth/drive.file';


const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December" ];
                    
const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                         "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

const calendarDays = [ "r11", "r12", "r13", "r14", "r15", "r16", "r17",
                       "r21", "r22", "r23", "r24", "r25", "r26", "r27",
                       "r31", "r32", "r33", "r34", "r35", "r36", "r37",
                       "r41", "r42", "r43", "r44", "r45", "r46", "r47",
                       "r51", "r52", "r53", "r54", "r55", "r56", "r57",
                       "r61", "r62", "r63", "r64", "r65", "r66", "r67"]


var buttonForm = document.getElementById('buttonForm');
var divLogin = document.getElementById('divLogin');
var divLogout = document.getElementById('divLogout');

var divDate = document.getElementById('dateToday');
var divMonthYear = document.getElementById('monthyear');
// var divCalendarHead = document.getElementById('calendarhead');
// var divYear = "" 

var divEventDates = document.getElementById('eventdates');
var divGuestList = document.getElementById('guestlist');

const today = new Date();
const todayDate = today.getDate()
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();

var viewingYear = todayYear;
var viewingMonth = todayMonth;

var eventItems = {}
var eventItemActive = {}

var eventDates = []
var eventUsers = []

var calendarDates = []

var userDisplayName = ""
var userEmailAddress = ""

var schedFiles

    
window.addEventListener('load', function () {
    
    updateCalendar()
    
})

function updateCalendar () {
    
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0');
    // var yyyy = today.getFullYear();
    
    // divMonthYear.innerHTML = monthNames[today.getMonth()] + " " + viewingYear; 
    divMonthYear.innerHTML = monthNames[viewingMonth] + " " + viewingYear; 
    
    // var dayOne = getFirstDay( today.getMonth(), viewingYear )
    var dayOne = getFirstDay( viewingMonth, viewingYear )
    
    // clear the calendar
    for ( var i = 0 ; i < calendarDays.length ; i++ ) {
        calendaritem = document.getElementById( calendarDays[ i ] )
        calendaritem.innerHTML = 0
        calendaritem.classList.remove("monthcurrent")
        calendaritem.classList.remove("dayenabled")
    }
    
    // build the calendar for the selected month
    for ( var i = 0 ; i < daysInMonth( viewingMonth, viewingYear ) ; i++ ) {
        calendaritem = document.getElementById( calendarDays[ dayOne.getDay()+i ] )
        calendaritem.innerHTML = i+1
        calendaritem.classList.add("monthcurrent")
    }
    
    // fill last month
    for ( var i = dayOne.getDay() ; i > 0 ; i-- ) {
        calendaritem = document.getElementById( calendarDays[ dayOne.getDay()-i ] )
        calendaritem.innerHTML = parseInt(daysInMonth( viewingMonth-1, viewingYear )-i+1)
    }
    
    // fill next month
    for ( var i = daysInMonth( viewingMonth, viewingYear ) + dayOne.getDay() ; i < calendarDays.length ; i++ ) {
        calendaritem = document.getElementById( calendarDays[ i ] )
        calendaritem.innerHTML = i - daysInMonth( viewingMonth, viewingYear ) - dayOne.getDay() + 1
    }
    
    
    // TODO: 
    // display any actively selected days
    
    
    
    // for testing
    // var dayToday = calendarDays[today.getDate()+dayOne.getDay()-1]
    // dateclick( dayToday ) 
    
    // console.log( "todayDate: " + todayDate )
    // console.log( "todayYear: " + todayYear )
    // console.log( "todayMonth: " + monthNames[todayMonth] )
    
    
    
}

function dateclick ( item ) {
    
    // var today = new Date();
    // console.log("dateclick: " + item )
    
    // record the date 
    // year, month, day
    
    
    // datelist = document.getElementById("eventdates")
    datelist = document.getElementById("content")
    
    itemclicked = document.getElementById(item)
    
    itemday = itemclicked.innerText
    itemmonth = viewingMonth
    
    if ( parseInt(itemday) < 10 ) { itemday = "0" + itemday }
    if ( parseInt(itemmonth) < 10 ) { itemmonth = "0" + itemmonth }
    
    itemdate = viewingYear + "." + itemmonth + "." + itemday
    console.log("itemdate: " + itemdate )
    
    // remove
    if ( itemclicked.classList.contains("dayenabled") ) {
        
        var index = calendarDates.indexOf(itemdate)
        if ( index > -1 ) {
            calendarDates.splice(index, 1);
        }
        
        itemclicked.classList.remove("dayenabled")
        itemclicked.classList.add("daydisabled")
        
        if ( itemclicked.classList.contains("monthcurrentenabled") ) {
        
            itemclicked.classList.remove("monthcurrentenabled")
            itemclicked.classList.add("monthcurrent")
            
        }
    } 
    
    // add
    else {
        
        calendarDates.push(itemdate)
        
        itemclicked.classList.remove("daydisabled")
        itemclicked.classList.add("dayenabled")
        
        if ( itemclicked.classList.contains("monthcurrent") ) {
        
            itemclicked.classList.remove("monthcurrent")
            itemclicked.classList.add("monthcurrentenabled")
            
        }
    }
    
    // console.log(calendarDates)
    calendarDates = calendarDates.sort()
    
    datelist.innerHTML = "Dates Clicked: "
    
    for ( i = 0 ; i < calendarDates.length ; i++ ) {
        // datelist.innerHTML += "<br>" + calendarDates[i]
        
        // datesplit = calendarDates[i].split(".")
        // datelist.innerHTML += "<br>" + monthNames[parseInt(datesplit[1])] + " " + parseInt(datesplit[2]) + ", " + datesplit[0]
        
        // datelist.innerHTML += "<br>" + monthNames[viewingMonth] + " " + itemclicked.innerText + ", " + viewingYear
        // console.log("clicked: " + monthNames[viewingMonth] + " " + itemclicked.innerText + ", " + viewingYear )
        // itemdate = monthNames[viewingMonth] + " " + itemclicked.innerText + ", " + viewingYear
    }
    
    
}

function changeMonth( value ) { 
    viewingMonth += parseInt(value)
    updateCalendar()
}

function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}

function getFirstDay (month, year) {
    return new Date(year, month, 1);
}



function handleCredentialResponse( obj ) {
    console.log("handleCredentialResponse...")
    
    const responsePayload = parseJwt( obj.credential );
    
    // console.log( "OBJECT: " + JSON.stringify( responsePayload ) );
    // console.log( "ID: " + responsePayload.sub );
    // console.log( 'Full Name: ' + responsePayload.name );
    // console.log( 'Given Name: ' + responsePayload.given_name );
    // console.log( 'Family Name: ' + responsePayload.family_name );
    // console.log( "Image URL: " + responsePayload.picture );
    // console.log( "Email: " + responsePayload.email );
    
}

function parseJwt( token ) {
    var base64Url = token.split( '.' )[ 1 ];
    var base64 = base64Url.replace( /-/g, '+' ).replace( /_/g, '/' );
    var jsonPayload = decodeURIComponent( atob( base64 ).split( '' ).map( function( c ) {
        return '%' + ( '00' + c.charCodeAt( 0 ).toString( 16 ) ).slice( -2 );
    } ).join( '' ) );
    return JSON.parse( jsonPayload );
};






// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

let tokenClient;
let gapiInited = false;
let gisInited = false;



/**
* Callback after api.js is loaded.
*/
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

/**
* Callback after the API client is loaded. Loads the
* discovery doc to initialize the API.
*/
async function intializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    // checkEnableButtons();
    
}

/**
* Callback after Google Identity Services are loaded.
*/
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    // checkEnableButtons();
}

/**
* Enables user interaction after all libraries are loaded.
*/
function checkEnableButtons() {
    if (gapiInited && gisInited) {
        // document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        // document.getElementById('signout_button').style.visibility = 'visible';
        // document.getElementById('authorize_button').innerText = 'Refresh';
        await listFiles();
        await getUser(); 
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: ''});
        // tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        // document.getElementById('content').innerText = '';
        // document.getElementById('authorize_button').innerText = 'Authorize';
        // document.getElementById('signout_button').style.visibility = 'hidden';
        
        document.getElementById('signout_div').style.display = 'none';
        document.getElementById('signin_div').style.display = 'block';
        
        location.reload();
    }
}

async function getUser() {
    let response;
    try {
        response = await gapi.client.drive.about.get({
        'fields': 'user(displayName,emailAddress)',
        // 'fields': 'user',
        });
    } catch (err) {
        // document.getElementById('content').innerText = err.message;
        console.log(err)
        return;
    }
    const user = response.result.user;
    // if (!files || files.length == 0) {
        // document.getElementById('content').innerText = 'No files found.';
        // return;
    // }
    
    document.getElementById('signout_div').style.display = 'block';
    document.getElementById('signin_div').style.display = 'none';
    
    // document.getElementById('googleUser').innerText = `${user.displayName}`;
    // document.getElementById('googleEmail').innerText = `${user.emailAddress}`;
    
    userDisplayName = `${user.displayName}`;
    userEmailAddress = `${user.emailAddress}`;
    
}

async function listFiles() {
    
    let response;
    
    try {
        response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': 'files(id, name)',
        'q': "name contains 'sched.id.' and name contains '.txt' and trashed = false",
        // 'q': "mimeType = 'application/vnd.google-apps.file' and name contains 'sched.id.'",
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }
    
    // const files = response.result.files;
    schedFiles = response.result.files;
    
    if (!schedFiles || schedFiles.length == 0) {
        document.getElementById('content').innerText = 'No files found.';
        return;
    }
    
    getFile( schedFiles[0].id, true )
    
}

async function getFile( fileId, update ) {
    
    gapi.client.drive.files.get({
        'fileId': fileId,
        'alt': 'media'
    })
    .then((response)=>{
        eventItemActive = JSON.parse(response.body)
        if (update) {
            getEventInfo()
        }
    })
    
}

async function pushFile( fileId ) {
    
    const url = 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media';
    
    if(self.fetch){
        
        var setHeaders = new Headers();
        var atoken = gapi.client.getToken().access_token
        var adata = JSON.stringify(eventItemActive)
        
        setHeaders.append('Authorization', 'Bearer ' + atoken);
        setHeaders.append('Content-Type', 'application/json');

        var setOptions = {
            method: 'PATCH',
            // method: 'POST',
            // method: 'PUT',
            headers: setHeaders,
            body: adata
        };

        fetch( url, setOptions )
        .then(response => { if(response.ok){
                console.log("Saved to drive");
            }
            else{
                console.log("Response not ok");
                console.log("Response", response);
            }
        })
        .catch(error => {
            console.log("Error: " + error.message);
        });
    }

}



// https://stackoverflow.com/questions/38539158/how-to-update-already-existing-file-in-google-drive-api-v3-java

/*
const url = 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media';
if(self.fetch){
    var setHeaders = new Headers();
    setHeaders.append('Authorization', 'Bearer ' + authToken.access_token);
    setHeaders.append('Content-Type', mime);

    var setOptions = {
        method: 'PATCH',
        headers: setHeaders,
        body: data 
    };

    fetch(url,setOptions)
    .then(response => { if(response.ok){
            console.log("Saved to drive");
        }
        else{
            console.log("Response was not ok");
        }
    })
    .catch(error => {
        console.log("There is an error " + error.message);
    });
}
*/



function getEventInfo() {
    
    eventDates = eventItemActive["dates"]
    eventUsers = eventItemActive["users"]
    
    // console.log( "eventUsers: ", eventUsers )
    
    buildEventUsers()
    buildEventDates()
    
}
function buildEventUsers() {
    
    let eusers = "<div class='edemail' style='grid-column:1;grid-row:1'></div>" 
    let guestlist = ""
    
    for (user in eventUsers) {
        let row = parseInt(user) + 2
        // console.log( eventUsers[user]["email"] )
        
        let eid = "mail." + row
        
        eusers += "<div id='" + eid + "' "
        eusers += "class='edemail' style='grid-column:1;grid-row:" + row + "'>"
        eusers += eventUsers[user]["email"] + "</div>"
        
        guestlist += eventUsers[user]["email"] + "<br>"
        // guestlist += eventUsers[user]["email"] + " : " + eventUsers[user]["name"] + "<br>"
        
    }
    
    divEventDates.innerHTML = eusers
    divGuestList.innerHTML = guestlist
    
}
function buildEventDates() {
    
    let edates = ""
    
    for (date in eventDates) {
        
        let column = parseInt(date) + 2
        
        let eventData = eventDates[date]["date"]
        let eventArrYMD = eventDates[date]["date"].split(".")        
        let eventMonth = monthNamesShort[parseInt(eventArrYMD[1])]
        
        let did = "date.1." + column 
        
        edates += "<div id='" + did + "' class='edheader' data-value='" + eventData + "'"
        edates += "style='grid-row:1;grid-column:" + column + "'>" 
        edates += eventMonth + "<br>"
        edates += eventArrYMD[2] + "</div>"
        
        buildEventChecks( column, eventDates[date]["users"] )
        
    }
    
    divEventDates.innerHTML += edates
    
}
function buildEventChecks( column, users ) {
    
    // console.log(users)
    
    let echecks = ""
    
    for (user in eventUsers) {
        
        let row = parseInt(user) + 2
        let ischecked = ""
        
        if ( users.includes(eventUsers[user]["email"]) ){
            ischecked = "checked='checked'"
        }
        
        let checkType = "<input type='checkbox' " + ischecked + " onclick='return false'>"
        let cid = "check." + row + "." + column
        
        if ( eventUsers[user]["email"] == userEmailAddress ){
            checkType =  "<input id='" + cid + "'"
            checkType += "type='checkbox'" + ischecked
            checkType += " onclick=\"changeResponse('" + row + "','" + column + "')\">"
        }
        
        echecks += "<div class='edcheck' style='grid-column:" + column
        echecks += ";grid-row:" + row + "'>"
        echecks += checkType
        echecks += "</div>"
        
    }
    
    divEventDates.innerHTML += echecks
    
}

function changeResponse( row, column ) {
    
    let eid = "mail." + row
    let did = "date.1." + column
    let cid = "check." + row + "." + column
    
    var checkDate  = document.getElementById(did);
    var checkEmail = document.getElementById(eid);
    var checkCheck = document.getElementById(cid);
    
    console.log( "checkEmail:", checkEmail.innerText )
    console.log( "checkCheck:", checkCheck.checked )
    console.log( "checkDate:", checkDate.dataset.value )
    
    
    
    // first pull data to get the latest file
    getFile( schedFiles[0].id, false )
    
    // update the data that has changed
    // console.log("eventItemActive before: ", eventItemActive )
    
    // let dateChanged
    
    for ( date in eventItemActive["dates"] ) {
        if (eventItemActive["dates"][date]["date"] == checkDate.dataset.value ) {
            // dateChanged = date
            
            // console.log("users before: ",eventItemActive["dates"][date]["users"])
            
            if (checkCheck.checked){
                eventItemActive["dates"][date]["users"].push(checkEmail.innerText)
            }
            else {
                let index = eventItemActive["dates"][date]["users"].indexOf(checkEmail.innerText)
                eventItemActive["dates"][date]["users"].splice(index,1)
            }
            
            // console.log("users after: ",eventItemActive["dates"][date]["users"])
            
        }
    }
    
    // then push the file back to the drive
    pushFile( schedFiles[0].id ) 
    
    
    
    // eventItemActive["dates"][][]
    // console.log("eventItemActive after: ", eventItemActive )
    
    
    
    // let foobar = checkDate.dataset.value
    // console.log(foobar)
    
    // let pdid = "#" + did
    // console.log( "pdid", pdid)
    // console.log( "pdid data", $(pdid).data('value') )
    // console.log( "pdid data", $('#date.1.2').data('value') )
    
    // let foobar = $('#date.1.2').data('value')
    // console.log(foobar)
    
    
}

function addEventUser( addUser ) {
    console.log( "addEventUser: ", addUser )
}

function addEventDate( addDate ) {
    console.log( "addEventDate: ", addDate )
    
}
function removeEventDate( removeDate ) {
    console.log( "removeEventDate: ", removeDate )
}
function addUserDate() {
    
}
function removeUserDate() {
    
}


function test() {
    
    console.log( Date.now() )
    
    let date = Date.now()
    
    console.log(date.toLocaleString('en-US'));      // "1/20/2022, 9:50:15 AM"
    console.log(date.toLocaleDateString('en-US'));  // "1/20/2022"
    console.log(date.toLocaleTimeString('en-US'));  // "9:50:15 AM"
    
}
