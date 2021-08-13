/* Copyright 2021 AJE https://github.com/jenevieveee */

var skinsettings = {
    skindefault: true,
    skinmetal: false,
    skinprincess: false,
    overrideblog: false
};

console.log( "JKit-skin loaded" );

loadOptions_skin();

function loadOptions_skin() {
    let settings = browser.storage.local.get( "skinsettings" );
	settings.then( loadCSS_skin, onGetSettingsError );
}

function loadCSS_skin( results ) {

	var head = document.getElementsByTagName('HEAD')[0];
    var body = document.getElementsByTagName('BODY')[0];
    let path = "";
    let bannerpath = "";
    let isBlog = false;
	
	let bSkinDef = results.skinsettings.skindefault;
    let bSkinMetal = results.skinsettings.skinmetal;
    let bSkinPrincess = results.skinsettings.skinprincess;
    let bOverrideBlog = results.skinsettings.overrideblog;
    
    if (window.location.hostname == "bdsmlr.com" ||
        window.location.hostname == "www.bdsmlr.com") {
        isBlog = false;
    }
    else {
        isBlog = true;
        if ( bOverrideBlog == false) {
            return; // don't do anything
        }
    }
    	
	if (bSkinDef ) {
        // default; do nothing
        return;
    }
    else if (bSkinMetal) {
        path = browser.extension.getURL( "/css/metal.css" );
        bannerpath = browser.extension.getURL( "/img/skins/gunmetal.png" );
    }
    else if (bSkinPrincess) {
        path = browser.extension.getURL( "/css/princess.css" );
        bannerpath = browser.extension.getURL( "/img/skins/princess.png" );
    }	

	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = path;
    link2 = link.cloneNode();
	head.appendChild(link);
    //we have to do this to work around the in-lining of the css after head
    body.appendChild(link2);
    
   	var logo = document.getElementsByClassName("logo")[0];
    oldLogo = logo.removeChild(logo.firstChild);

    while (logo.firstChild) {
        logo.removeChild(logo.firstChild);
    }
    let newLogo = document.createElement("img");
    newLogo.setAttribute("src", bannerpath );
    newLogo.style.height = "auto";
    newLogo.style.maxWidth = "100%";
    newLogo.style.visibility = "visibile";
    newLogo.style = oldLogo.style;
    logo.appendChild( newLogo );
}
