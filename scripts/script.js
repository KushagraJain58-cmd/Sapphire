///////////////// SLIDESHOW LOGIC ///////////////////
var $slider = $('.slideshow .slider'),
	maxItems = $('.item', $slider).length,
	dragging = false,
	tracking,
	rightTracking;

$sliderRight = $('.slideshow').clone().addClass('slideshow-right').appendTo($('.split-slideshow'));

rightItems = $('.item', $sliderRight).toArray();
reverseItems = rightItems.reverse();
$('.slider', $sliderRight).html('');
for (i = 0; i < maxItems; i++) {
	$(reverseItems[i]).appendTo($('.slider', $sliderRight));
}

$slider.addClass('slideshow-left');
$('.slideshow-left')
	.slick({
		vertical: true,
		verticalSwiping: true,
		arrows: false,
		infinite: true,
		dots: true,
		speed: 1000,
		cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
	})
	.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
		if (currentSlide > nextSlide && nextSlide == 0 && currentSlide == maxItems - 1) {
			$('.slideshow-right .slider').slick('slickGoTo', -1);
			$('.slideshow-text').slick('slickGoTo', maxItems);
		} else if (currentSlide < nextSlide && currentSlide == 0 && nextSlide == maxItems - 1) {
			$('.slideshow-right .slider').slick('slickGoTo', maxItems);
			$('.slideshow-text').slick('slickGoTo', -1);
		} else {
			$('.slideshow-right .slider').slick('slickGoTo', maxItems - 1 - nextSlide);
			$('.slideshow-text').slick('slickGoTo', nextSlide);
		}
	})
	.on('mousewheel', function(event) {
		event.preventDefault();
		if (event.deltaX > 0 || event.deltaY < 0) {
			$(this).slick('slickNext');
		} else if (event.deltaX < 0 || event.deltaY > 0) {
			$(this).slick('slickPrev');
		}
	})
	.on('mousedown touchstart', function() {
		dragging = true;
		tracking = $('.slick-track', $slider).css('transform');
		tracking = parseInt(tracking.split(',')[5]);
		rightTracking = $('.slideshow-right .slick-track').css('transform');
		rightTracking = parseInt(rightTracking.split(',')[5]);
	})
	.on('mousemove touchmove', function() {
		if (dragging) {
			newTracking = $('.slideshow-left .slick-track').css('transform');
			newTracking = parseInt(newTracking.split(',')[5]);
			diffTracking = newTracking - tracking;
			$('.slideshow-right .slick-track').css({
				transform: 'matrix(1, 0, 0, 1, 0, ' + (rightTracking - diffTracking) + ')'
			});
		}
	})
	.on('mouseleave touchend mouseup', function() {
		dragging = false;
	});

$('.slideshow-right .slider').slick({
	swipe: false,
	vertical: true,
	arrows: false,
	infinite: true,
	speed: 950,
	cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
	initialSlide: maxItems - 1
});

setInterval(function() {
	$('.slideshow-left').slick('slickNext');
}, 5000);

$('.slideshow-text').slick({
	swipe: false,
	vertical: true,
	arrows: false,
	infinite: true,
	speed: 900,
	cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
});

// JavaScript code
const mainElement = document.getElementById('main-element');
const slickDotsElement = document.querySelector('.slideshow .slick-dots');

window.addEventListener('scroll', function() {
	const rect = mainElement.getBoundingClientRect();

	if (rect.bottom < 0 || rect.top > window.innerHeight) {
		slickDotsElement.classList.add('hide');
	} else {
		slickDotsElement.classList.remove('hide');
	}
});

///////////////// SLIDESHOW LOGIC ENDED ///////////////////

//////// NAV ICON CLICK /////////
const navIcon = document.querySelector('.nav-icon');
const nav = document.querySelector('nav');
navIcon.addEventListener('click', () => {
	if (nav.classList.contains('shown')) {
		nav.classList.remove('shown');
		navIcon.classList.remove('close');
		nav.style.height = 0 + 'px';
	} else {
		nav.classList.add('shown');
		navIcon.classList.add('close');
		nav.style.height = nav.scrollHeight + 150 + 'px';
	}
});

/*********** PRODUCTS SLIDESHOW ******************/
const carousel = document.querySelector('.carousel'),
	firstImg = document.querySelectorAll('img')[0];
const arrowIcons = document.querySelectorAll('.wrapper .icon');

let isDragStart = false,
	isDragging = false,
	prevPageX,
	prevScrollLeft,
	positionDiff;

arrowIcons.forEach((icon) => {
	icon.addEventListener('click', () => {
		let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
		// if clicked icon is left, reduce width value from the carousel scroll left else add to it
		carousel.scrollLeft += icon.id == 'left' ? -firstImgWidth : firstImgWidth;
	});
});

const autoSlide = () => {
	// if there is no image left to scroll then return from here
	if (carousel.scrollLeft == carousel.scrollWidth - carousel.clientWidth) return;

	positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
	let firstImgWidth = firstImg.clientWidth + 14;
	// getting difference value that needs to add or reduce from carousel left to take middle img center
	let valDifference = firstImgWidth - positionDiff;

	if (carousel.scrollLeft > prevScrollLeft) {
		// return console.log("user is scrolling to the right");
		// if user is scrolling to the right
		return (carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
	}
	//   console.log("user is scrolling to the left");
	// if user is scrolling to the left
	carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
};

const dragStart = (e) => {
	// updating global variables value on mouse down event
	isDragStart = true;
	prevPageX = e.pageX || e.touches[0].pageX;
	prevScrollLeft = carousel.scrollLeft;
};

const dragging2 = (e) => {
	// scrolling images/carousel to left according to mouse pointer
	if (!isDragStart) return;
	e.preventDefault();
	isDragging = true;
	carousel.classList.add('dragging');
	positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
	carousel.scrollLeft = prevScrollLeft - positionDiff;
};

const dragStop = () => {
	isDragStart = false;
	carousel.classList.remove('dragging');

	if (!isDragging) return;
	isDragging = false;
	autoSlide();
};

carousel.addEventListener('mousedown', dragStart);
carousel.addEventListener('touchstart', dragStart);

carousel.addEventListener('mousemove', dragging2);
carousel.addEventListener('touchmove', dragging2);

carousel.addEventListener('mouseup', dragStop);
carousel.addEventListener('mouseleave', dragStop);
carousel.addEventListener('touchend', dragStop);
