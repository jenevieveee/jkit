/* Copyright 2021 AJE */
/* 
 * JKit-goon
 * 
 * Reminds you goon periodically 
 */

console.log( "JKit-goon loaded" );
loadOptions_goon();

function loadOptions_goon() {
    loadOptions_jkit( "goonsettings", load_goon );
}

function load_goon( results) {
    bGoonActive = results.goonsettings.goonactive;
    bSissyActive = results.goonsettings.sissyactive;
    
    if (bGoonActive == true ) {
        setRandomMinuteTimer_jkit( 0, 1, show_goon );
    }
    if (bSissyActive == true ) {
        setRandomMinuteTimer_jkit( 0, 1, show_sissy );
    }
}

function show_goon() {
   let seq = Math.floor( Math.random() * 15 ) + 1; 
   let urlt = "img/goon/g" + seq + ".gif";
   let urls = browser.runtime.getURL( urlt );

   remove_goon();
   let goonImage = document.createElement("img");
   styleImgage( goonImage, "goonette", urls );
   
   let allposts = document.querySelectorAll(".image_content");
   for (let post of allposts) {
      let fc = post.firstChild;
      let miniMe = goonImage.cloneNode();
	  post.appendChild( miniMe, fc );
   }
   setTimeout( remove_goon, 2000 );
    // check every time through
   loadOptions_goon();
}

function show_sissy() {
   let seq = Math.floor( Math.random() * 20 ) + 1;  
   if ( seq <= 7 ) {
    let urlt = "img/sissy/s" + seq + ".jpg";
   }
   else {
      let urlt = "img/sissy/s" + seq + ".gif";
   }
      let urls = browser.runtime.getURL( urlt );

   remove_sissy();
   let sissyImage = document.createElement("img");
   styleImgage( sissyImage, "sissygoon", urls );
   
   let allposts = document.querySelectorAll(".image_content");
   for (let post of allposts) {
      let fc = post.firstChild;
      let miniMe = sissyImage.cloneNode();
	  post.appendChild( miniMe, fc );
   }
   setTimeout( remove_sissy, 2000 );
    //check every time through
   loadOptions_goon();
}

function styleImage( img, goontype, sUrl ) {
   img.setAttribute("src", sUrl );
   img.style.height = "auto";
   img.style.maxWidth = "100%";
   img.style.zIndex = "1000";
   img.style.visibility = "visibile";
   img.className = goontype;
} 

function remove_goon( ) {
   let currentGoons = document.querySelectorAll(".goonette");
    for (let goon of currentGoons) {
      goon.remove();
    }
}
function remove_sissy( ) {
   let currentGoons = document.querySelectorAll(".sissygoon");
    for (let goon of currentGoons) {
      goon.remove();
    }
}
