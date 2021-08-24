/* Copyright 2021 AJE https://github.com/jenevieveee */
/* JKit-common
 * Common Fuctions. This file should be loaded before other module scripts
 */

/** Prints error to console 
 * @param error - the error to Print
 */
function onGetSettingsError( error ) {
  console.log(`Error fetching settings: ${error}`);
}

/* Generic error logger. */
function onError(e) {
	console.error(e);
}

/** Loads options set, then calls handler
 * @param settingsName -- settings key to get 
 * @param jkit_callback -- callback to take results from local storage
 */
function loadOptions_jkit( settingsName, jkit_callback) {
	let settings = browser.storage.local.get( settingsName );
	settings.then( jkit_callback, onGetSettingsError );
}

/** Sets a timer to execute callback random minutes from now
 * @param low - minimum minutes to wait
 * @param high - maximum minutes to wait
 * @param jkit_callback - callback to invoke on timer expiration.
 */
function setRandomMinuteTimer_jkit( low, high, jkit_callback ) {
    let lowMin = 60 * low;
    let highMin = high * 60 - lowMin;
    let minuteTimerValue = Math.floor(Math.random() * highMin) + lowMin; // from every low to high minutes
   minuteTimerValue = minuteTimerValue * 1000; // ms to s.
   setTimeout( jkit_callback, minuteTimerValue );
}

function unixtime() {
	let ts = Math.round((new Date()).getTime() / 1000);
	return ts;
}

function addCssFile( head, path ) {
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	let cssurl = browser.runtime.getURL( path );
	link.href = cssurl;
	head.appendChild(link);
}

