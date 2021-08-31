/* Copyright 2021 AJE https://github.com/jenevieveee */
/* JKit-dash
 * 
 * Various Tweaks for the dash 
 */

/* TODO: add floating avatars
   position: sticky; top 100px;
*/

var bBigReblog = false;
var bReblogOnBottom = false;
var bReblogGrid = false;
var bShortenPosts = false;
var bSetFixActivityClick= false;
var bUpdatedActivitiesSdata = false;
var bSetFixEntitiesClick = false;
var bUpdatedActivitiesEntities = false;
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
	searchfocus: false,
    
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
	let head = document.getElementsByTagName('HEAD')[0];
	bBigReblog = results.dashsettings.bigreblog;
    bReblogOnBottom = results.dashsettings.reblogonbottom;
    bReblogGrid = results.dashsettings.rebloggrid;
    bShortenPosts = results.dashsettings.shortenposts;
    bNoAppNotice = results.dashsettings.noappnotice;
	bSearchFocus = results.dashsettings.searchfocus;
	bFloatAvi = results.dashsettings.floatavi;
    
    bFixCdn05 = results.dashsettings.fixcdn05;
    bFixActivity = results.dashsettings.fixactivity;
	bFixEntityCodes = results.dashsettings.fixentities;
    
    bMessagesLayout = results.dashsettings.messageslayout;
	
    
 
    // Tweaks
	if ( bBigReblog == true ) addCssFile( head, "css/BigReblog.css" );
	if ( bReblogOnBottom == true ) addCssFile( head, "css/ReblogOnBottom.css" );
	if ( bReblogGrid == true ) addCssFile( head, "css/ReblogGrid.css" );
	if ( bShortenPosts == true ) addCssFile( head, "css/ShortenPosts.css" );
	if ( bNoAppNotice == true ) addCssFile( head, "css/AppNotice.css" );
	if ( bFloatAvi == true ) addCssFile( head, "css/FloatAvi.css" );
	

	if ( bSearchFocus == true ) setSearchFocus();
    
    // Fixes
    if ( bFixCdn05 == true ) fixCdn05();
    if ( bFixActivity == true ) fixActivity();
	if ( bFixEntityCodes == true ) {
		addCssFile( head, "css/ActivityAlign.css" );
		fixEntities();
	}
    
    // Full-page changes
	if ( bMessagesLayout == true && window.location.pathname.includes("messages")) {
		addCssFile( head, "css/messages.css" );
	}	
}

function fixCdn05() {    
    imgs = document.querySelectorAll("img");
    for (i=0; i<imgs.length; i++ ) {
        let img = imgs[i];
        if ( img.src.includes("cdn05") ) {
            newsrc = img.src.replace(/cdn05/g, 'cdno05' );
            img.src = newsrc;
        }
    }
    hrefs = document.querySelectorAll("a");
    for (i=0; i<hrefs.length; i++ ) {
        let curr_href = hrefs[i];
        if ( curr_href.href.includes("cdn05") ) {
            newhref = curr_href.href.replace(/cdn05/g, 'cdno05' );
            curr_href.href = newhref;
        }
    }
    // re-run every 2s to handle scrolling.
    setTimeout( fixCdn05, 2000);
}

function fixActivity() {
    if ( bSetFixActivityClick == false ) {
        let bolts = document.getElementsByClassName("bolttop");
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

function setSearchFocus() {
	magglass = document.getElementsByClassName("far fa-search");
	// The timeout is to ensure that the un-hide happens first, so the element is focus-able.
	if ( magglass && magglass[0] ) {
		magglass[0].addEventListener("click", function() { setTimeout( setSearchFocus2, 200 );} );
	}
}

function setSearchFocus2() {
	searchInput = document.getElementById("searchtext");
	searchInput.focus(); 
}

function fixEntities() { 
	if ( bSetFixEntitiesClick == false ) {
		let bolts = document.getElementsByClassName("bolttop")
		for (let i = 0; i < bolts.length; i ++ ) {
			bolts[i].addEventListener('click', function() { setTimeout( updateEntitiesListener1, 500); } );
		}
		bSetFixEntitiesClick = true;
	}
	fixTitlesEntitiesInit();
}

function fixTitlesEntitiesInit() {
	window.onscroll = updateEnititesWindow;
	// Wait 1s for page to load and panels to be fetched
	// This needs to be done once on page load; after that the listener handles it.
	setTimeout(fixTitlesEntities, 1000 );
}
function updateEnititesWindow( ev ) {
	// update the page when it loads more posts.
	if (document.body.scrollHeight > currHeight) {
		currHeight = document.body.scrollHeight;
		fixTitlesEntities();
	}
}

function fixTitlesEntities() {
	let titles = document.getElementsByClassName("titletext");
	if (titles.length == 0 ) {
		let allposts = document.getElementsByClassName("post_info");
		// posts haven't been fetched yet. Try Again.
		if ( allposts.length == 0 ) {
			setTimeout(fixTitlesEntities, 1000 );
		}
	}
	for (let i = 0; i < titles.length; i ++ ) {
		let str = titles[i].innerHTML;		
		let str2 = str.replace(/&amp;/g, "&").replace(/&nbsp;/g, " "); //non-breaking space.

		titles[i].innerHTML = str2;
	}
}

function updateEntitiesListener1() {
	//latestnotes isn't present in the DOM until the activity icon is clicked, 
	// so we need to double-chain the listeners.
	let showComments = document.getElementsByClassName("latestnotes")[0];
	if ( showComments == null ) {
		// hasn't loaded yet
		setTimeout( updateEntitiesListener1, 500 );
	}
	else {
		showComments.addEventListener('click', function() { setTimeout( updateEntitiesListener2, 200); } );
	}
};

function updateEntitiesListener2() {
	let allActivities = document.getElementsByClassName("allActivityPosts")[0];
	let comments = document.getElementsByClassName("singlecommenttop");
	let fixedComments = document.getElementsByClassName("jkit-singlecommenttop");
	for ( let i=0; i < comments.length; i++ ){
		let str = comments[i].innerHTML;		
		let str2 = str.replace(/&amp;/g, "&").replace(/(&nbsp;)+/g, "<br>");
		comments[i].innerHTML = str2;
		comments[i].className = "jkit-singlecommenttop";
		bUpdatedActivitiesEntities = true;
	}
	
	if ( comments.length == 0 && fixedComments.length == 0 ) {
		// We updated, but there's nothing there now, indicating they closed the activity pane.
		// Another click of the lightning icon will restart the scan/replace.
		bUpdatedActivitiesSdata = false;
	}
	else {
		// check for scroll-down/data refresh
		setTimeout( updateEntitiesListener2, 2000 );
	}
}	
