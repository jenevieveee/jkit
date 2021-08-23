/* Copyright 2021 AJE https://github.com/jenevieveee */

const tagBundlesActiveInput = document.querySelector("#TagBundlesActive");

const bundleNameInput = document.querySelector("#BundleNameInput");
const bundleTagsInput = document.querySelector("#BundleTagsInput");

//save
const saveTagsInput = document.querySelector("#SaveTagBundle");

// Save the tags
saveTagsInput.addEventListener("click", () => {storeTagSettingsEntry( false );} );

// Save the on/off 
tagBundlesActiveInput.addEventListener("click", () => {storeTagSettingsEntry( true );} );

/* On opening the options page, fetch stored settings and update the UI with them. */
const gettingStoredSettingsTags = browser.storage.local.get("tagssettings");
gettingStoredSettingsTags.then(updateTagsUI, tagsOnGetError);

function storeTagSettingsEntry( onlyActiveField ) {
    let gettingOldTags = browser.storage.local.get("tagssettings");
    gettingOldTags
        .then( (results) => {storeTagSettings(results, onlyActiveField);}, tagsOnGetError );
}

function storeTagSettings( existingTags, onlyActiveField ) {
    console.log("Saving tag bundles");
    let tagssettings = existingTags.tagssettings;
    if ( onlyActiveField ) {
        tagssettings["tagsactive"] = tagBundlesActiveInput.checked || false;
    }
    else {
        if ( bundleNameInput.value != "" && bundleTagsInput != "" ) {
            tagssettings[ bundleNameInput.value ] = bundleTagsInput.value;
        }   
        // clear tags entry on submit.
        bundleNameInput.value = "";
        bundleTagsInput.value = "";
    }
    
    browser.storage.local.set( { tagssettings } );
    console.log("Done saving Tags");
    updateTagsUI( {tagssettings} );
}

/* Update the options UI with the settings values retrieved from storage, or default to false */
function updateTagsUI(results) {
    let tagssettings = results.tagssettings;
    let keys = Object.keys(tagssettings);
	let tagTable = document.querySelector("#tagtable");
    console.log(keys);
    
    // delete the old table 
    let oldRows = document.getElementsByClassName("tagsrow");
    for (let i=oldRows.length-1; i >=0; i-- ) {
        let row = oldRows[i];
        row.parentNode.removeChild(row);
    }
    let oldAddAnotherRow = document.getElementById("addanotherrow");
    if ( oldAddAnotherRow )
        oldAddAnotherRow.parentNode.removeChild(oldAddAnotherRow);
    
    tagBundlesActiveInput.checked = tagssettings.tagsactive;
    let keysfound = 0;
	for (key in tagssettings) {
        //TODO: change the structure so that tags meta settings are separate from user settings.
        //      But get it working at all first.
        if ( key == "tagsactive" ) continue;
     
        let row = tagTable.insertRow();
        row.className = "tagsrow";
        let nCell = row.insertCell();
        let nText = document.createTextNode( key );
        nCell.appendChild( nText );
        let vCell = row.insertCell();
        let vText = document.createTextNode( tagssettings[ key ] );
        vCell.appendChild( vText );
        let dCell = row.insertCell();
        let dButton = document.createElement("button");
        dButton.innerHTML = "X";
        dButton.value = "del" + key;
        dButton.addEventListener( "click", deleteTag );
        dCell.appendChild( dButton );
        keysfound++;
    }
    let row = tagTable.insertRow();
    let cell = row.insertCell();
    let addAnotherText = document.createTextNode( "Add another Bundle" );
    cell.colSpan = 3;
    cell.id = "addanotherrow";
    cell.appendChild( addAnotherText );
    
        
}

function deleteTag(e) {
    // TODO: add pop-up confirm
    let id = e.target.value.substr(3);
    let gettingOldTags = browser.storage.local.get( "tagssettings" );
    gettingOldTags.then( (res) => { deleteTagEntry(res, id ); }, tagsOnGetError );
}

function deleteTagEntry( results, id ) {
    let tagssettings = results.tagssettings;
    delete tagssettings[id];
    browser.storage.local.set( { tagssettings } );
    updateTagsUI( {tagssettings} );
}

function tagsOnGetError( e ) {
    console.error( "Tags Error: " + e );
}


    
    
