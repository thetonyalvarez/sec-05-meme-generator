const form = document.getElementById('meme-form')
const memeWrapper = document.getElementById('meme-results-section')
const urlInput = document.querySelector('input[name="url"]')
const topInput = document.querySelector('input[name="top-text"]')
const bottomInput = document.querySelector('input[name="bottom-text"]')


// retrieve localStorage if it exists; else create new array
let allMemes = JSON.parse(localStorage.getItem('allMemes')) || [];

// scan through the allMemes array for existing memes
for (let i = 0; i < allMemes.length; i++) {

	let newMeme = document.createElement('div');
	newMeme.className = 'meme-result'
	newMeme.id = allMemes[i].id

	let newMemeImg = document.createElement('img');
	let newMemeTop = document.createElement('div');
	let newMemeBtm = document.createElement('div');
	let memeHover = document.createElement('div');
	let memeHoverRemove = document.createElement('div');
	let spanRemove = document.createElement('span')

	newMemeImg.className = 'meme-image'
	newMemeTop.classList = 'meme-text meme-text_top'
	newMemeBtm.classList = 'meme-text meme-text_btm'

	newMemeImg.src = allMemes[i].memeImage;
	newMemeTop.innerText = allMemes[i].topText;
	newMemeBtm.innerText = allMemes[i].btmText;

	newMeme.appendChild(newMemeImg);
	newMeme.appendChild(newMemeTop);
	newMeme.appendChild(newMemeBtm);

	memeHover.classList = 'hover invisible';
	
	memeHoverRemove.classList = 'meme-actions remove';
	
	spanRemove.innerText = 'DELETE';
	spanRemove.classList = 'remove-action';
	
	memeHoverRemove.prepend(spanRemove);

	memeHover.appendChild(memeHoverRemove);

	newMeme.appendChild(memeHover);

	memeWrapper.appendChild(newMeme)
}



form.addEventListener('submit', function(e) {

	e.preventDefault();
	
	// first, validate if the URL has an image extension
	// if not, create an alert 
	let validateImgUrl = function(url) {
		return url.value.match(/\.(jpeg|jpg|gif|png)$/) ? url.value : alert('Please enter a valid image URL!')
	}

	// Then, create variables that will be passed to newMeme object later
	let memeImage = validateImgUrl(urlInput)
	let topText = topInput.value;
	let bottomText = bottomInput.value;

	// generate a random id for the meme and assign it to a variable to pass to newMeme object later
	let memeId = 'meme-' + (Math.floor(Math.random() * 10000000))

	// If a field is empty, let the user know through an alert
	// Can I rewrite this as an error??
	// BUG: if URL is NOT a valid image extension, then both alerts pop up
	if (!memeImage || !topText || !bottomText) {
		alert('Make sure to fill in all fields!')
		return
	}
	
	// Create a div that contains the generated meme
	let newMeme = document.createElement('div');
	newMeme.className = 'meme-result';
	newMeme.id = memeId;
	
	// Create div children (inside 'meme-result') to house the image and meme text overlays
	let newMemeImg = document.createElement('img');
	newMemeImg.className = 'meme-image'
	newMemeImg.src = memeImage;
	newMeme.appendChild(newMemeImg);

	let newMemeTop = document.createElement('div');
	newMemeTop.classList = 'meme-text meme-text_top'
	newMemeTop.innerText = topText;
	newMeme.appendChild(newMemeTop);

	let newMemeBtm = document.createElement('div');
	newMemeBtm.classList = 'meme-text meme-text_btm'
	newMemeBtm.innerText = bottomText;
	newMeme.appendChild(newMemeBtm);
	
	// create a position:absolute overlay that will appear on hover
	let memeHover = document.createElement('div');
	memeHover.classList = 'hover invisible';

	// Inside the overlay div, add a child div that will act as our "delete" button
	let memeHoverRemove = document.createElement('div');
	memeHoverRemove.classList = 'meme-actions remove';

	// Add a span to encase the target element that will trigger the deletion, so that
	// only the target element deletes the meme, and not the entire div wrapper
	let spanRemove = document.createElement('span')
	spanRemove.innerText = 'DELETE';
	spanRemove.classList = 'remove-action';
	
	// Append the span element to the "remove" div
	memeHoverRemove.prepend(spanRemove);

	// Append the remove div to the overlay wrapper
	memeHover.appendChild(memeHoverRemove);

	// append the hover element to the parent meme element itself
	newMeme.appendChild(memeHover);

	// append the new meme to the div section that contains all generated memes
	memeWrapper.appendChild(newMeme);
	
	// create a new meme object with the inputs stored as vales of object keys
	newMemeObject = {
		memeImage: urlInput.value,
		topText: topInput.value,
		btmText: bottomInput.value,
		id: memeId
	};
	
	// push the meme object to the allMemes array
	allMemes.push(newMemeObject);
	
	// set the allMemes storage object to the stringified version of the allMemes array
	localStorage.setItem('allMemes', JSON.stringify(allMemes));
	// set a new item in localStorage that saves the most recently generated meme
	localStorage.setItem('currentMeme', JSON.stringify(newMemeObject));
	
	// reset the form to clear the fields
	form.reset();
})


// Listen for clicks inside the results div
memeWrapper.addEventListener('mouseover', function(e) {

	// Assign a new var to the target
	let currentMeme = e.target.parentElement.parentElement;

	// if the clicked element contains the 'meme-result' class, we know that the click is
	// on the meme result the user wants to interact with
	if (currentMeme.classList.contains('meme-result')) {

		// Create anonymous function to show the delete overlay on hover
		currentMeme.onmouseover = function() {
			currentMeme.children[3].classList = 'hover visible'
		}

		// Create anonymous function to hide the delete overlay off hover
		currentMeme.onmouseout = function() {
			currentMeme.children[3].classList = 'hover invisible'
		}
		
	}
})

memeWrapper.addEventListener('click', function(e) {
	currentMeme = e.target;

	// if span.remove-action is clicked...
	if (currentMeme.className == 'remove-action') {


		targetMeme = currentMeme.parentElement.parentElement.parentElement
		targetId = targetMeme.id

		// iterate through the memes stored in allMemes array
		for (let i = 0; i < allMemes.length; i++) {

			// access the ids for each meme
			tempId = allMemes[i].id
			
			// if the id for the iterated item matches the id of the clicked meme...
			if (tempId == targetId) {
				
				// remove the meme from the allMemes array
				allMemes = allMemes.filter(meme => meme != allMemes[i]);

				// and reset allMemes item in localStorage 
				localStorage.setItem('allMemes', JSON.stringify(allMemes));
			}
		}

		// Then remove the meme from the screen
		targetMeme.remove();

	}
	
})

// just for fun, let's animate h1 using the random colors demo
randomColors = () => {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	return `rgb(${r},${g},${b})`
};

setInterval(function() {
	document.querySelector('h1').style.color = randomColors();
})