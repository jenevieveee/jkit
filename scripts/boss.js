/* Copyright 2021 AJE https://github.com/jenevieveee */
/*
JKit-BOSS

BOSS replaces BDSMLR with google if you leave the site inactive for more than
10 minutes.

Useful for when you accidentally leave the site open.

*/
const GOOGLE = "https://google.com";
var time_boss;
var iBossScreenTimeout = 10;

console.log( "JKit-boss loaded" );
loadOptions_jkit( "bosssettings", load_boss );
/*
function loadOptions_boss() {
	let settings = browser.storage.local.get( "bosssettings" );
	settings.then( load_boss, onGetSettingsError );
}
*/
function load_boss(  results ) {
	bBossActive = results.bosssettings.bossscreen;
    iBossScreenTimeout = results.bosssettings.bossscreentimeout;
    
    if ( bBossActive == true ) {
        window.onload = resetTimer_boss;
        document.onmousemove = resetTimer_boss;
        document.onkeydown = resetTimer_boss;
    }
    else {
        clearTimeout(time_boss);
    }
}

function hideMe() {
    location.href = GOOGLE;
}

function resetTimer_boss() {
    clearTimeout(time_boss);
    time = setTimeout(hideMe, iBossScreenTimeout * 1000 * 60 );
}

