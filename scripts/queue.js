/* Copyright 2021 AJE JKit https://www.github.com/jenevieveee/jkit */

console.debug(" Loading queue/drafts tweaks");

const upperZoneNode = document.getElementsByClassName("upperzone")[0];
const timeZoneChangeNode = document.getElementsByClassName("timezonechange")[0];
const instructionsNode = document.getElementsByClassName("instructions")[0];
const limitbytimeNode = document.getElementsByClassName("limitbytime")[0];
const postsinqueueNode = document.getElementsByClassName("postsinqueue")[0];

loadOptions_jkit( "dashsettings", queuetweaks );

function queuetweaks( res ) {
	if ( !res || !res.dashsettings )
		return;
	if ( res.dashsettings.queuecleanup && window.location.pathname.includes("/queuev2") )
		cleanupQueue();
	if ( res.dashsettings.queuecleanup && window.location.pathname.includes("/drafts") )
		cleanupDraft();
	if ( res.dashsettings.sensiblesearch )
		sensibleSearchSetup();
	if ( res.dashsettings.fixnotsearch && window.location.pathname.split('/').includes("search") )
		fixNotSearch();
}

function cleanupQueue() {
	let announce = document.getElementsByClassName("announce")[0];
	let mqu = document.createElement("a");
	mqu.innerHTML= "Mass Queue Uploader";
	mqu.href = "/queue";
	while (announce.firstChild ) {
		announce.removeChild( announce.firstChild );
	}
	announce.appendChild(mqu);
	announce.style.float = "left";
	
	let showInstructions = document.createElement("div");
	showInstructions.innerHTML="Show Instructions";
	showInstructions.className = "announce";
	showInstructions.style.float = "right";
	
	announce.parentNode.insertBefore( showInstructions, announce.nextSibling );
	showInstructions.addEventListener("click", unhideQueueInstructions );
	
	instructionsNode.style.display = "none";
	timeZoneChangeNode.style.display = "none";
	upperZoneNode.style.display = "none";
}

function unhideQueueInstructions( /* MouseEvent */ ev ) {
	instructionsNode.style.display = "inherit";
	timeZoneChangeNode.style.display = "inherit";
	upperZoneNode.style.display = "inherit";
}
	
function cleanupDraft() {
	let addphotos = document.getElementsByClassName("addphotos")[0];
	let announce = document.getElementsByClassName("announce")[0];
	let mdudiv = document.createElement("div");
	mdudiv.className = "announce";
	mdudiv.style.float = "left";
	let mdu = document.createElement("a");
	mdu.innerHTML= "Mass Draft Uploader";
	mdu.href = "/draftbulk";
	mdudiv.appendChild(mdu);
	addphotos.removeChild( announce );
	addphotos.insertBefore( mdudiv, addphotos.firstChild );
	
	let showInstructions = document.createElement("div");
	showInstructions.innerHTML="Show Instructions";
	showInstructions.className = "announce";
	showInstructions.style.float = "right";
	
	addphotos.insertBefore( showInstructions, mdudiv.nextSibling );
	showInstructions.addEventListener("click", unhideDraftInstructions );
	addphotos.insertBefore( document.createElement("br"), showInstructions.nextSibling );
	
	instructionsNode.style.display = "none";
	limitbytimeNode.style.display = "none";
	postsinqueueNode.style.display = "none";
}
	
function unhideDraftInstructions(ev) {
	instructionsNode.style.display = "inherit";
	limitbytimeNode.style.display = "inherit";
	postsinqueueNode.style.display = "inherit";
}

function sensibleSearchSetup() {
	let searchInput = document.getElementsByClassName("form-control")[0];
	if ( searchInput )
		addEventListener("keydown", (ev) => { sss_key_handler( ev, searchInput);} );
}

function sss_key_handler( /* KeyboardEvent */ kev, searchInput ) {
	if ( kev.key == "Enter" ) {
		value = searchInput.value;
		searchInput.value = "";
		terms = value.replace(" AND ", ", &&, ")
					.replace(" OR ", ", ")
					.replace(" NOT ", ", !")
					.replace(" -",", !")
					.replace(" || ", ", ")
					.split(",");
		let newTerms = [];
		let andTerms = [];
		let notTerms = [];
		let isAndTerm = false;
		let wasAndTerm = false;
		for( let i=0; i < terms.length; i++) {
			let term = terms[i].trim();
			if ( isAndTerm ) {
				// if this is the second and term, add it to andTerms
				andTerms.push (term );
				wasAndTerm = true;
				isAndTerm = false;
				continue;
			}
			if (term == "&&" && i > 0) {
				// if this is the and operator, remove the previous OR term and add it to andTerms
				prevTerm = newTerms.pop();
				if ( !wasAndTerm ) {
					andTerms.push (prevTerm);
				}
				wasAndTerm = false;
				isAndTerm = true;
				continue;
			}
			if (term.startsWith("!") ) {
				notTerms.push(term.substr(1));
				continue;
			} 
			newTerms.push( term );
		}
		let andString = "";
		let notString = "";
		if ( andTerms.length > 0 ) {
			andString = "'" + andTerms[0];
			for (let j = 1; j < andTerms.length; j++ ) {
				andString = andString + ", " + andTerms[j];
			}
			andString = andString + "'";
			newTerms.push( andString );
		}
		if ( notTerms.length > 0 ) {
			notString = '"' + notTerms[0];
			for (let j = 1; j < notTerms.length; j++ ) {
				notString = notString + ", " + notTerms[j];
			}
			notString = notString + '"';
			newTerms.push( notString );
		}
		
		searchInput.value = newTerms[0];
		for (let i=1; i<newTerms.length; i++ ) {
			searchInput.value = searchInput.value + ", " + newTerms[i];
		}
	}
}

function fixNotSearch() {
	let location = decodeURI(window.location.pathname);
	let notTerms = [];
	let len = location.length;
	let currPos = 0;
	
	while (currPos < len ) {
		let firstSubstr = location.substr(currPos);
		currPos = firstSubstr.indexOf('"') + 1;
		if ( currPos == 0 )
			break; // no more quotes
			
		
		
		let endTermPtr = location.substr(currPos).indexOf('"');
		let innerTerms = location.substr(currPos, endTermPtr).split(",");
		for ( let i = 0; i < innerTerms.length; i++ ) {
			notTerms.push( innerTerms[i].trim() );
		}
		currPos = currPos + endTermPtr + 1;
	}
	if ( notTerms.length == 0 )
		return;
	
	let searchPosts = document.getElementsByClassName("searchpost");
	for (let i = 0; i < searchPosts.length; i ++ ) {
		let currPost = searchPosts[i];
		let postTags = currPost.getElementsByClassName("tag");
		for ( let j=0; j<postTags.length; j++ ) {
			let a = postTags[ j ];
				currPost.style.top = "auto";
				currPost.style.left = "auto";
				currPost.style.position = "static";
			let s = a.firstElementChild; // If it has the chat bubble, then the tag is in a <span>
			let t = "";
			if ( s ) {
				t = s.innerHTML.trim().substring(1);
			}
			else {
				t = a.innerHTML.trim().substring(1);
			}
			if ( notTerms.includes( t ) ) {
				currPost.style.visibility = "hidden";
				currPost.style.maxHeight = "0";
				currPost.style.maxWidth = "0";
				currPost.style.height = "0";
				currPost.style.width = "0";
				currPost.style.display = "none";
				break;
			}
		} // for j
	}
	let pagination = document.getElementsByClassName("pagination")[0];
	let newPag = pagination.cloneNode(true);
	let searchTitle = document.getElementsByClassName("searchtitle")[0];
	searchTitle.parentNode.insertBefore( newPag, searchTitle);
	let newfeed = document.getElementsByClassName("newsfeed")[0];
	newsfeed.style.height = "auto";
}
		
		
		
	
	
