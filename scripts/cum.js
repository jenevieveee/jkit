/* Copyright 2021 AJE https://github.com/jenevieveee */
/* JKit-cum
 * 
 * Covers your screen in spunk
 */

console.log( "JKit-cum loaded" );

var timeleft_cum = 0.0;
var cumImage = document.createElement("img");

loadOptions_jkit( "cumsettings", load_cum );

function load_cum(  results ) {
	bCumActive = results.cumsettings.cumactive;
    
    if ( bCumActive) {
        setTimer_cum();
    }
}
    
function setTimer_cum() {
    setRandomMinuteTimer_jkit(.5, 2, show_cum );
}

function show_cum() {
   let seq = Math.floor( Math.random() * 5 ); // One of 5 images TODO: Add more
   let urlt = "img/cum/splat" + seq + ".png";
   let urls = browser.extension.getURL( urlt );
   cumImage = document.createElement("img");
   cumImage.setAttribute("src", urls );
   cumImage.style.height = "auto";
   cumImage.style.maxWidth = "100%";
   cumImage.style.zIndex = "1000";
   cumImage.style.visibility = "visibile";
   cumImage.className = "cumsplash";
   cumImage.style.position = "fixed";
   cumImage.style.bottom = "25vh"; 
   let lPos = Math.floor( Math.random() * 25 ) + 25 + "vw";
   cumImage.style.left = lPos;
   document.body.appendChild( cumImage );
   timeleft_cum = 1.0;
   fadeImage_cum( );
}

function fadeImage_cum() {
    timeleft_cum = timeleft_cum - .1;
    cumImage.style.opacity = timeleft_cum;
    if ( timeleft_cum < .4 ) {
		cumImage.remove();
		loadOptions_jkit( "cumsettings", load_cum); // Recheck every cycle
	} else {
        let hPos = Math.floor(25 * timeleft_cum) + "vh";
        cumImage.style.bottom = hPos;

	    setTimeout( fadeImage_cum, 1000 );
	}
}
