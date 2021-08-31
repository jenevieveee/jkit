/* Copyright 2021 AJE https://github.com/jenevieveee */

/* tags.js -- tag management daemon module for JKit */

console.log( "JKit-tags daemon loading" );

// Load the tags.
// Don't do anything unless this is bdsmlr
//if ( window.location.hostname.includes("bdsmlr.com") ) {
	tagssettingsPromise = browser.storage.local.get( "tagssettings");
	tagssettingsPromise.then( createTagsMenu, onBgTagsError );

	// Add a listener to update the menus if a tag is added.
	browser.storage.onChanged.addListener( updateTagsMenu );
//}

function createTagsMenu( results ) {
	// We need this happen in-order, so the remove  calls to create in
	// either the success or failure cases.
    browser.contextMenus.remove( "TagBundlesMenu" ).then( () => { createTagsMenu2( results ); }).catch( () => { createTagsMenu2(results); } );
}
function createTagsMenu2( results ) {
    if ( results.tagssettings && results.tagssettings.tagsactive ) {
        browser.contextMenus.create( {
            id: "TagBundlesMenu",
            title: "Tag Bundles",
            contexts: ["editable"]
        });
    }
    // Add each bundle as a child of Tag Bundles
    if ( results.tagssettings ) {
        for (key in results.tagssettings ) {
            if ( key == "tagsactive" ) continue;
            browser.contextMenus.create( {
                id: "TagBundlesMenu_" + key,
                title: key,
                contexts: ["editable"],
                parentId: "TagBundlesMenu"
            });
        }
    }
    //console.log("Done creating menus");
}

browser.contextMenus.onClicked.addListener((info, tab) => {    
    let bundleId = info.menuItemId.substr(15);
    //console.log( "clicked on " + realId );
	browser.tabs.query( {currentWindow:true, active:true} )
		.then( function (tabs) { sendMessageToCS(tabs, bundleId ); })
		.catch(onBgTagsError);
});

function sendMessageToCS( tabs, id ) {
    console.log( "Sending Message to CS" );
    browser.tabs.sendMessage( tabs[0].id, {tagbundle: id} )
        .then( ( results ) => { console.log( "Received response with message: " + results.response ); } )
        .catch( (error) => { console.log( "No response from context script. Error: " + error ); } );
}
 
function updateTagsMenu( changes, area ) {
    // don't care about non-local storage
    if ( area != "local" ) { return; }
    
    if ( changes.tagssettings ) {
        let tagssettings = {};
        let keys = Object.keys( changes.tagssettings.newValue );
        //console.log ("Keys: " + keys);
        for ( let i=0; i<keys.length; i++) {
            let key = keys[i];
            tagssettings[ key ] = changes.tagssettings.newValue[ key ];
        }
        let results = {};
        console.log( "tagssettings: " + tagssettings);
        results[ "tagssettings" ] = tagssettings;
        createTagsMenu( results );
    }
}

function onBgTagsError( error ) {
  console.log(`Error in tags tags daemon: ${error}`);
}


