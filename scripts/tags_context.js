/* Copyright 2021 AJE https://www.github.com/jenevieveee/jkit */
/* Tags content script for JKit */

console.log("Loading tags context script" );

// cache this so we don't have to get() from storage every time
var tctagssettings = { tagsactive: false };
let gettingTagsSettings = browser.storage.local.get( "tagssettings");
gettingTagsSettings.then( updateTagsCache, onTagsTCError );

browser.runtime.onMessage.addListener( addTagsToElement );

function updateTagsCache( results ) {
    if (results.tagssettings ) {
        tctagssettings = results.tagssettings;
    }    
}

function addTagsToElement( request ) {
    // console.log( "Got message: " + request );
    
    bundleId = request.tagbundle;
    let tagit_arr = document.getElementById("Tags").getElementsByClassName("tagit-new");
    let tagit_input = tagit_arr[0].firstChild;
    
    //Extra commas don't hurt
    tagit_input.value = tagit_input.value + ", " + tctagssettings[ bundleId ] + ",";
    // send response back to daemon
    return Promise.resolve({ response: "Added tags" } );
}

function onTagsTCError( error ) {
  console.log(`Error in tags CS: ${error}`);
}
