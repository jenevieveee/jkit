/* Copyright 2021 AJE https://github.com/jenevieveee */


// JKit-boss: Boss Screen
const bossScreenInput = document.querySelector("#BossScreen");
const bossScreenTimeoutInput = document.querySelector("#BossScreenTimeout");

// JKit-dash: Dash tweaks
const bigReblogInput = document.querySelector("#BigReblog");
const reblogOnBottomInput = document.querySelector("#ReblogOnBottom");
const reblogGridInput = document.querySelector("#ReblogGrid");
const shortenPostsInput = document.querySelector("#ShortenPosts");
const appNoticeInput = document.querySelector("#AppNotice");
const searchFocusInput = document.querySelector("#SearchFocus");
const floatAviInput = document.querySelector("#FloatAvi");

const fixCdn05Input = document.querySelector("#FixCdn05");
const fixActivityInput = document.querySelector("#FixActivity");

const messagesLayoutInput = document.querySelector("#MessagesLayout");

//JKit-skin: Skins
const skinDefaultInput = document.querySelector("#SkinChoiceDefault");
const skinPrincessInput = document.querySelector("#SkinChoicePrincess");
const skinMetalInput = document.querySelector("#SkinChoiceMetal");
const overrideBlogInput = document.querySelector("#OverrideBlog");

//MPE 
const mpeActiveInput = document.querySelector("#MPEActive");

//Mute
const muteActiveInput = document.querySelector("#MuteActive");
const muteTimeoutInput = document.querySelector("#MuteTimeout");

//save
const saveInput = document.querySelector("#SaveInput");

saveInput.addEventListener("click", storeSettings);

// Because Chrome is slow AF, the pre-load of storage won't complete until after the
// get, so relax for a few ticks.
setTimeout( function () {
	/* On opening the options page, fetch stored settings and update the UI with them. */
	const gettingStoredSettingsOpt = browser.storage.local.get();
	gettingStoredSettingsOpt.then(updateUI, onError);
}, 100 );

function storeSettings() {
    console.log("Saving dash tweaks settings");

    browser.storage.local.set( {
        bosssettings: {
            bossscreen: bossScreenInput.checked,
            bossscreentimeout: bossScreenTimeoutInput.value
        },
        dashsettings: {
            bigreblog: bigReblogInput.checked,
            reblogonbottom: reblogOnBottomInput.checked,
            rebloggrid: reblogGridInput.checked,
            shortenposts: shortenPostsInput.checked,
            noappnotice: appNoticeInput.checked,
			searchfocus: searchFocusInput.checked,
			floatavi : floatAviInput.checked,
      
            fixcdn05: fixCdn05Input.checked,
            fixactivity: fixActivityInput.checked,
      
            messageslayout: messagesLayoutInput.checked
        },
        skinsettings: {
            skindefault: skinDefaultInput.checked,
            skinmetal: skinMetalInput.checked,
            skinprincess: skinPrincessInput.checked,
            overrideblog: overrideBlogInput.checked
        },
		mutesettings: {
			muteactive: muteActiveInput.checked,
			mutetimeout: 30
        },
		mpesettings: {
			mpeactive: mpeActiveInput.checked
		}		
    } );
    console.log("Done saving");
}

/* Update the options UI with the settings values retrieved from storage, or default to false */
function updateUI(results) {
    let keys = Object.keys(results);
    restoredSettings = results[keys[0]];
    console.log( keys );

  // Boss screen
    bossScreenInput.checked = results.bosssettings.bossscreen || false;
    bossScreenTimeoutInput.value = results.bosssettings.bossscreentimeout || 10;
  
  // Dash tweaks
    bigReblogInput.checked = results.dashsettings.bigreblog || false;
    reblogOnBottomInput.checked = results.dashsettings.reblogonbottom || false;
    reblogGridInput.checked = results.dashsettings.rebloggrid || false;
    shortenPostsInput.checked = results.dashsettings.shortenposts || false;
    appNoticeInput.checked = results.dashsettings.noappnotice || false;
    searchFocusInput.checked = results.dashsettings.searchfocus || false;
	floatAviInput.checked = results.dashsettings.floatavi || false;
  
    fixCdn05Input.checked = results.dashsettings.fixcdn05 || false;
    fixActivityInput.checked = results.dashsettings.fixactivity || false;
  
    messagesLayoutInput.checked = results.dashsettings.messageslayout || false;

  // mpe
	mpeActiveInput.checked = results.mpesettings.mpeactive || false;
	
  // Goonette:
  //  goonActiveInput.checked = results.goonsettings.goonactive || false;
  //  sissyActiveInput.checked = results.goonsettings.sissyactive || false;
  
  // Skin buttons
    skinDefaultInput.checked = results.skinsettings.skindefault || true;
    skinMetalInput.checked = results.skinsettings.skinmetal || false;
    skinPrincessInput.checked = results.skinsettings.skinprincess || false;
    overrideBlogInput.checked = results.skinsettings.overrideblog || false;
    
    muteActiveInput.checked = results.mutesettings.muteactive || false;
    muteTimeoutInput.value = results.mutesettings.mutetimeout || 10;
}

function onError(e) {
    console.error( " Settins Error: " + e);
}
