/* Copyright 2021 AJE https://github.com/jenevieveee */
/* JKit-dash
 * 
 * Various Tweaks for the dash 
 */

var bBigReblog = false;
var bReblogOnBottom = false;
var bReblogGrid = false;
var bShortenPosts = false;
var bSetFixActivityClick= false;
var bUpdatedActivitiesSdata = false;
var bNoAppNotice = false;

var bFixCdn05 = false;
var bFixActivity = false;

var bMessagesLayout = false;

var dashsettings = {
    bigreblog: false,
    reblogonbottom: false,
    rebloggrid: false,
    shortenposts: false,
    noappnotice: false,
    
    fixcdn05: false,
    fixactivity: false,
    
    messageslayout: false
}

console.log( "JKit-dash-tweaks loaded" );

loadOptions_dash();

function loadOptions_dash() {
	let settings = browser.storage.local.get( "dashsettings" );
	settings.then( loadCSS_dash, onGetSettingsError );
}

function loadCSS_dash( results ) {
	var head = document.getElementsByTagName('HEAD')[0];
	bBigReblog = results.dashsettings.bigreblog;
    bReblogOnBottom = results.dashsettings.reblogonbottom;
    bReblogGrid = results.dashsettings.rebloggrid;
    bShortenPosts = results.dashsettings.shortenposts;
    bNoAppNotice = results.dashsettings.noappnotice;
    
    bFixCdn05 = results.dashsettings.fixcdn05;
    bFixActivity = results.dashsettings.fixactivity;
    
    bMessagesLayout = results.dashsettings.messageslayout;
    
 
    // Tweaks
	if ( bBigReblog == true ) setDashTweak( head, "css/BigReblog.css" );
	if ( bReblogOnBottom == true ) setDashTweak( head, "css/ReblogOnBottom.css" );
	if ( bReblogGrid == true ) setDashTweak( head, "css/ReblogGrid.css" );
    if ( bShortenPosts == true ) setDashTweak( head, "css/ShortenPosts.css" );
    if ( bNoAppNotice == true ) setDashTweak( head, "css/AppNotice.css" );
    
    // Fixes
    if ( bFixCdn05 == true ) fixCdn05();
    if ( bFixActivity == true ) fixActivity();
    
    // Full-page changes
    if ( bMessagesLayout == true ) setDashTweak( head, "css/messages.css" );
}

function setDashTweak( head, path ) {
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	let cssurl = browser.extension.getURL( path );
	link.href = cssurl;
	head.appendChild(link);
}

function fixCdn05() {
    document.body.innerHTML = document.body.innerHTML.replace(/cdn05/g, 'cdno05');
}

function fixActivity() {
    if ( bSetFixActivityClick == false ) {
        let bolts = document.getElementsByClassName("bolttop")
        for (let i = 0; i < bolts.length; i ++ ) {
            bolts[i].addEventListener('click', function() { setTimeout( updateSdataListeners, 500); } );
        }
        bSetFixActivityClick = true;
    }
}    

function updateSdataListeners() {
        let activities = document.getElementsByClassName("sdata");
        let fixedActivities = document.getElementsByClassName("jkit_sdata");
        for (  let i=0; i < activities.length; i++ ) {
            let activity = activities[i];
            //change the class name so JQuery can't find it.
            activity.className = "jkit_sdata";
        }
        
        if ( activities.length > 0 && bUpdatedActivitiesSdata == false ) {
            bUpdatedActivitiesSdata = true;
        }
        
        if ( activities.length == 0 && fixedActivities.length == 0 && bUpdatedActivitiesSdata == true ) {
            // We updated, but there's nothing there now, indicating they closed the activity pane.
            // Another click of the lightning icon will restart the scan/replace.
            bUpdatedActivitiesSdata = false;
        }
        else {
            // check for scroll-down/data refresh
            setTimeout( updateSdataListeners, 2000 );
        }
}
