/* Copyright 2021 AJE https://www.github.com/jenevieve/jkit */

// Adds a mute button under the avatar for all posts.

console.log(" JKit-mute loaded" );
var currHeight = document.body.scrollHeight;

browser.storage.onChanged.addListener( function() {
	loadOptions_jkit( "mutesettings", initMute );
});

loadOptions_jkit( "mutesettings", initMute );
//browser.storage.local.get( "mutesettings" ).
//	then( initMute );

function updateWindow( ev ) {
	// update the page when it loads more posts.
	if (document.body.scrollHeight > currHeight) {
		currHeight = document.body.scrollHeight;
		addMuteButton();
		hideUsers( null, false );
	}
}
	
function initMute( results ) {
	if ( results && results.mutesettings ) {
		if (results.mutesettings.muteactive ) {
			window.onscroll = updateWindow;
			clearExpiredMutes( null, false );
			// Wait 1s for page to load and panels to be fetched
			setTimeout(addMuteButton, 1000 );
		}
	}
}

function addMuteButton() {
	let panels = document.getElementsByClassName("feed clearfix");
	if ( !panels || panels.length < 2) {
		// page hasn't fetched the panels yet.
		setTimeout( addMuteButton, 1000 );
	}

	let muteButton = document.createElement("img");
	let muteURL = browser.runtime.getURL( "img/mute-huge.png" );
	muteButton.setAttribute( "src", muteURL );
	muteButton.style.width = "32px";
	muteButton.style.height = "32px";
	muteButton.style.float = "left";
	muteButton.style.position = "relative";
	muteButton.style.marginLeft = "16px";
	//muteButton.addEventListener("click", startMutingSequence );
	muteButton.onclick = startMutingSequence;
	
	for (let i=0; i < panels.length; i++ ) {
		currPanel = panels[i];
		if (currPanel.className.includes("del") == false ) {
			continue; // not a content panel
		}
		// Have we already added a mute button?
		let maybeMuteButton = currPanel.getElementsByClassName("jkit-mute");
		if ( maybeMuteButton.length != 0 ) {
			// already added a mute button to this panel
			continue;
		}
		let muteButton_clone = muteButton.cloneNode();
		currPanel.appendChild( muteButton_clone );
		// These have to go after the element is added to the DOM
		muteButton_clone.addEventListener("click", startMutingSequence );
		muteButton_clone.className = "jkit-mute";
	}
}

function startMutingSequence( /* MouseEvent */ e ) {
	// Parent of muteButton is .feed.clearfix.delXXXXXXXX
	let panel = e.target.parentNode;
	if ( panel == null ) {
		// something went wrong
		console.log(" Can't get parent of Even target");
		return;
	}
	// to get the user, get the class ndata from under the panel
	anchorTarget = panel.getElementsByClassName("ndata");
	if ( anchorTarget == null || anchorTarget[0] == null ) {
		// something went wrong
		console.log(" Can't get ndata class from event parent");
		return;
	}
	let userId = anchorTarget[0].dataset.id;
	console.log( "Muting user " + userId );
	browser.storage.local.get( "mutesettings" ).
		then( (bslgres) => { setOrCheckUserMute( bslgres, userId ); } );
}

function setOrCheckUserMute( results, userId ) {
	let bUserFound = false;
	if ( results == null || results.mutesettings == null ) {
		// how did we get here?
		return;
	}
	if ( results.mutesettings.muteactive == false ) {
		// how did we get here?
		return;
	}
	if ( results.mutesettings[ userId ] ) {
		// user already exists
		return;
	}
	let ts = unixtime();
	let mutesettings = results.mutesettings;
	let endTime = ts + ( mutesettings.mutetimeout * 60 );
	mutesettings[ userId ] = endTime;

	browser.storage.local.set( { mutesettings } ).
		then( () => { clearExpiredMutes( results, false );} );
	return;
}

function clearExpiredMutes( results, bRecall ) {
	if ( results == null ) {
		if ( bRecall == true )
			return; // can't do anything. Maybe the next scroll action will fix, but bail for now.
		browser.storage.local.get( "mutesettings" ).
			then( (bslgres) => { clearExpiredMutes( bslgres, true ); } );
		//reinvoke when we have data;
		return;
	}
	let ts = unixtime();
	let mutesettings = results.mutesettings;
	for (let key in mutesettings  ) {
		if ( key == "muteactive" || key == "mutetimeout" )
			continue;
		let unmuteTime = mutesettings[ key ];
		if (unmuteTime < ts ) { 
			console.debug( "Clearing mute for expired user " + key );
			delete mutesettings[ key ];
		}
	}
	hideUsers( results, false );
}

function hideUsers( results, bRecall ) {
	if (results == null && bRecall == false ) {
		// use bRecall to avoid a stack bomb
		browser.storage.local.get( "mutesettings" ).
			then( (bslgres) => { hideUsers( bslgres, true ); } );
		//reinvoke when we have data
		return;
	}
	if (results == null && bRecall == true ) {
		setTimeout( hideUsers( null, false ), 1000 ); //recheck in 1s
	}
	// Sometimes, the hide doesn't get invoked until after the data load, before the next scroll event 
	// can register; you'll still see the posts. So reinvoke a second time just in case
	setTimeout( function () { hideUsers( results, true ); }, 2000 );
	// don't unhide existing mutesettings
	let mutedUserIds = Object.keys( results.mutesettings);
	let panels = document.getElementsByClassName("feed clearfix");
	if ( mutedUserIds.length <= 2 ) {
		console.debug( "No users to mute" );
		return; // muteactive and mutetimeout should be present, so we need at least 3 entries
	}
	for (i=0; i < panels.length; i++ ) {
		let currPanel = panels[i];
		if (currPanel.style.visibility == "hidden" )
			continue;
		if (currPanel.className.includes("del") == false ) {
			continue; // not a content panel; advert or user other panel type.
		}
		let anchorTarget = currPanel.getElementsByClassName("ndata");
		if ( anchorTarget == null || anchorTarget[0] == null ) {
			// something went wrong; shouldn't happen
			console.log(" Can't get ndata class from event parent");
			continue; // try the next one.
		}
		let susUserId = anchorTarget[0].dataset.id;
		if ( mutedUserIds.includes( susUserId ) ) {
			console.debug(" Panel " + currPanel.className + " has userid " + susUserId + ". Hiding" );
			// match. Hide panel
			currPanel.style.visibility = "hidden";
			currPanel.style.height = "0px";
			currPanel.style.minHeight = "0px";
			currPanel.style.minWidth = "0px";
			currPanel.style.width = "0px";
			// hide the inner panel, since it has min-height
			let newspanel = currPanel.getElementsByClassName("news");
			if ( newspanel && newspanel[0] ) {
				newspanel[0].style.visibility = "hidden";
				newspanel[0].style.height = "0px";
				newspanel[0].style.minHeight = "0px";
				newspanel[0].style.minWidth = "0px";
				newspanel[0].style.width = "0px";
			}
			// hide the avatar, since it has fixed height
			let avi = currPanel.getElementsByClassName("avatar");
			if ( avi && avi[0] ) {
				avi[0].style.visibility = "hidden";
				avi[0].style.height = "0px";
				avi[0].style.minHeight = "0px";
				avi[0].style.minWidth = "0px";
				avi[0].style.width = "0px";
			}
 			// We also have to hide the mute button, since it has fixed width
			let jkitmute = currPanel.getElementsByClassName("jkit-mute");
			if ( jkitmute && jkitmute[0] ) {
				jkitmute[0].style.visibility = "hidden";
				jkitmute[0].style.height = "0px";
				jkitmute[0].style.minHeight = "0px";
				jkitmute[0].style.minWidth = "0px";
				jkitmute[0].style.width = "0px";
			}
		}
	}
}
