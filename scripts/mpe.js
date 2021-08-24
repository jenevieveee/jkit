/* Copyright 2021 AJE https://www.github.com/jenevieveee/jkit */

/* mpe.je - Mass Post Editor enhancements */

console.log( "Mass Post Editor enhancements" );

loadOptions_jkit( "mpesettings", init_mpe );

function init_mpe( results ) {
	if (!results || !results.mpesettings ) {
		return;
	}	
	
	if (!results.mpesettings.mpeactive )
		return; // bail if not set.
		
	if ( window.location.pathname != "/massedit" ) 
		return; // Don't dink with the page unless its the mpe 
		
	let head = document.getElementsByTagName('HEAD')[0];
	let feed = document.getElementsByClassName("newsfeed")[0];
	let editbox = document.getElementsByClassName("editbox")[0];
	
	/* Inject styling CSS for the mpe */
	addCssFile( head, "css/jkit-mpe.css" );
	
	/* Create a pseudo-button */
	let selectAllButton = document.createElement("div");
	selectAllButton.className = "jkitmpe";
	selectAllButton.innerHTML = "Select All";
	//feed.appendChild( selectAllButton );
	feed.insertBefore( selectAllButton, editbox.previousSibling);
	selectAllButton.addEventListener("click", (ev) => {doWorkSelectAll(ev, true);} );
	
	let unselectAllButton = document.createElement("div");
	unselectAllButton.className = "jkitmpe";
	unselectAllButton.innerHTML = "Unselect All";
	feed.insertBefore( unselectAllButton, editbox.previousSibling);
	unselectAllButton.addEventListener("click", (ev) => {doWorkSelectAll(ev, false);} );
	
	feed.insertBefore( document.createElement("br"), editbox.previousSibling);
			
	let tagsLabel = document.createElement("div");
	tagsLabel.className = "jkitmpetext";
	tagsLabel.innerHTML = "Tags Select: ";
	feed.insertBefore( tagsLabel, editbox.previousSibling);
	
	let tagSearchInput = document.createElement("input");
	tagSearchInput.placeholder = " tag [ && tag2 ]"; 
	tagSearchInput.id = "jkit-tags-search";
	feed.insertBefore( tagSearchInput, editbox.previousSibling);
	
	let tagSearchButton = document.createElement("div");
	tagSearchButton.className = "jkitmpesmall";
	tagSearchButton.innerHTML = "Select";
	feed.insertBefore( tagSearchButton, editbox.previousSibling);
	tagSearchButton.addEventListener("click", (ev) => {doWorkSelectByTag(ev, true);} );
	
	let tagUnselectButton = document.createElement("div");
	tagUnselectButton.className = "jkitmpesmall";
	tagUnselectButton.innerHTML = "Unselect";
	feed.insertBefore( tagUnselectButton, editbox.previousSibling);
	tagUnselectButton.addEventListener("click", (ev) => {doWorkSelectByTag(ev, false);} );
	
	feed.insertBefore( document.createElement("br"), editbox.previousSibling);
	
	let textSearchLabel = document.createElement("div");
	textSearchLabel.className = "jkitmpetext";
	textSearchLabel.innerHTML = "Text Search: ";
	feed.insertBefore( textSearchLabel, editbox.previousSibling);
	
	let textSearchInput = document.createElement("input");
	textSearchInput.placeholder = " text "; 
	textSearchInput.id = "jkit-text-search";
	feed.insertBefore( textSearchInput, editbox.previousSibling);
		
	let textSearchButton = document.createElement("div");
	textSearchButton.className = "jkitmpesmall";
	textSearchButton.innerHTML = "Select";
	feed.insertBefore( textSearchButton, editbox.previousSibling);
	textSearchButton.addEventListener("click", (ev) => {doWorkSelectByText(ev, true);} );
	
	let textUnselectButton = document.createElement("div");
	textUnselectButton.className = "jkitmpesmall";
	textUnselectButton.innerHTML = "Unselect";
	feed.insertBefore( textUnselectButton, editbox.previousSibling);
	textUnselectButton.addEventListener("click", (ev) => {doWorkSelectByText(ev, false);} );
}

function doWorkSelectAll( /*MouseEvent*/ mev, bSelect ) {
	let checkboxes = document.getElementsByClassName("selectposts");
	
	for( let i=0; i < checkboxes.length; i++ ) {
		checkboxes[i].checked = bSelect;
	}
}

function doWorkSelectByTag( ev, bSelect ) {
	let posts = document.getElementsByClassName("postitem");
	let myTags = parseTags();
	for( let i=0; i < posts.length; i++ ) {
		let currPost = posts[i];
		let postTagsDiv = currPost.getElementsByClassName("tags")[0];
		if (postTagsDiv.childElementCount == 0 ) 
			continue;
		let thisPostCheckbox = currPost.getElementsByClassName("selectposts")[0];
		// Get the child of the tags div, but don't use children; we don't want the chat link.
		let postTags = postTagsDiv.getElementsByClassName("tag");
		let matchesRemaining = myTags.length;
		for (let j=0; j < postTags.length; j++ ) {
			let a = postTags[ j ];
 			let s = a.firstElementChild; // If it has the chat bubble, then the tag is in a <span>
			let t = "";
			if ( s ) {
				t = s.innerHTML.trim().substring(1);
			}
			else {
				t = a.innerHTML.trim().substring(1);
			}
			// easy case
			if ( myTags.length == 1 ) {
				if (t == myTags[0] ) {
					thisPostCheckbox.checked = bSelect;
					break;
				}
			}
			else {
				for (let k=0; k< myTags.length; k++ ) {
					if ( t == myTags[k] ) {
						matchesRemaining --;
						break;
					}
				}
				if ( matchesRemaining == 0 ) {
					thisPostCheckbox.checked = bSelect;
				}
			}
			
		}
	}
}	

function parseTags() {
	let myTagsInput = document.querySelector("#jkit-tags-search");
	let myTagsRawString = myTagsInput.value;
	let arr = [];
	if ( myTagsRawString.includes( "&&" )) {
		return parseTags2( myTagsRawString );
	}
	arr.push( myTagsRawString.trim() );
	return arr;
}

function parseTags2( instr ) {
	let arr = [];
	let elems = instr.split(/&&/);
	for (let i=0; i < elems.length; i++ )
		arr.push( elems[i].trim() );
	return arr;
}

function doWorkSelectByText( ev, bSelect ) {
	let posts = document.getElementsByClassName("postitem");
	let myTextInput = document.querySelector("#jkit-text-search");
	let mySearchTerm = myTextInput.value;
	
	for( let i=0; i < posts.length; i++ ) {
		let found = false;
		let currPost = posts[i];
		let postTitle = currPost.getElementsByClassName("titletext")[0];
		let postText = currPost.getElementsByClassName("textcontent")[0];
		let thisPostCheckbox = currPost.getElementsByClassName("selectposts")[0];
		
		if ( postTitle && postTitle.innerHTML.includes( mySearchTerm ) ) {
			thisPostCheckbox.checked = bSelect;
			continue;
		}
		if ( postText && postText.innerHTML.includes( mySearchTerm ) ) {
			thisPostCheckbox.checked = bSelect;
			continue;
		}
		let comments = currPost.getElementsByClassName("singlecommentline");
		
		for (let j=0; j < comments.length; j++ ) {
			if ( comments[ j ].innerHTML.includes( mySearchTerm ) ) {
				thisPostCheckbox.checked = bSelect;
				break;
			}
		}
	}
}	
		
	
	
