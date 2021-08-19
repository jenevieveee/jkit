/* Copyright 2021 AJE https://github.com/jenevieveee */

/* Default settings. Initialize storage to these values. */
var bosssettings = {
    bossscreen: false,
    bossscreentimeout: 10
};

var cumsettings = {
    cumactive: false
};

var dashsettings = {
    bigreblog: false
    ,reblogonbottom: false
    ,rebloggrid: false
    ,shortenposts: false
    ,messageslayout: false
	,searchfocus: false
    ,fixcdn05: false
    ,fixactivity: false
    ,noappnotice: false
};

var goonsettings = {
    goonactive: false
    ,sissyactive: false
};

var skinsettings = {
    skindefault: true
    ,skinmetal: false
    ,skinprincess: false
    ,overrideblog: false
};

var tagssettings = {
	tagsactive: false
};

console.log(" JKit - Getting previously stored JKit settings" );
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);

/* Generic error logger. */
function onError(e) {
    console.error(e);
}

/* On startup, check whether we have stored settings.
If we don't, then store the default settings. */
function checkStoredSettings(storedSettings) {
    if (!storedSettings.bosssettings) {
        browser.storage.local.set({bosssettings});
    }
    if (!storedSettings.cumsettings) {
        browser.storage.local.set({cumsettings});
    }
    if (!storedSettings.dashsettings) {
        browser.storage.local.set({dashsettings});
    }
    if (!storedSettings.goonsettings) {
        browser.storage.local.set({goonsettings});
    }
    if (!storedSettings.skinsettings) {
        browser.storage.local.set({skinsettings});
    }
    if (!storedSettings.tagssettings) {
        browser.storage.local.set({tagssettings});
    }
}
