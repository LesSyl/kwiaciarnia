const nav = document.querySelector('.nav-mobile')
const navBtn = document.querySelector('.burger-btn')
const allNavItems = document.querySelectorAll('.nav-mobile__items')
const navScroll = document.querySelector('.nav')
const faqItems = document.querySelectorAll('.flowerbox-faq__item')

window.addEventListener('scroll', () => {
	if (window.scrollY > 50) {
		navScroll.classList.add('nav-scrolled')
	} else {
		navScroll.classList.remove('nav-scrolled')
	}
})

const handleNav = () => {
	nav.classList.toggle('nav-mobile--active')

	allNavItems.forEach(item => {
		item.addEventListener('click', () => {
			nav.classList.remove('nav-mobile--active')
		})
	})

	handleNavItemsAnimation()
}

/////////////////////LINK ANIMATION MOBILE////////////////
const handleNavItemsAnimation = () => {
	let delayTime = 0

	allNavItems.forEach(item => {
		item.classList.toggle('nav-items-animation')
		item.style.animationDelay = '.' + delayTime + 's'
		delayTime++
	})
}

///////////////SLIDER//////////////////////

const sliders = [
	{
		track: document.querySelector('.bestsellers__cards'),
		prevBtn: document.querySelector('.bestsellers__arrow--left'),
		nextBtn: document.querySelector('.bestsellers__arrow--right'),
		cardClass: '.bestsellers__card',
		auto: true,
	},
	{
		track: document.querySelector('.reviews__cards'),
		prevBtn: null,
		nextBtn: null,
		cardClass: '.reviews__card',
		auto: true,
	},
]

const getScrollAmount = (track, cardClass) => {
	const card = track.querySelector(cardClass)
	const gap = parseFloat(getComputedStyle(track).gap) || 0

	return card.offsetWidth + gap
}

const scrollNext = (track, cardClass) => {
	const maxScrollLeft = track.scrollWidth - track.clientWidth

	if (track.scrollLeft >= maxScrollLeft - 6) {
		track.scrollTo({
			left: 0,
			behavior: 'smooth',
		})
	} else {
		track.scrollBy({
			left: getScrollAmount(track, cardClass),
			behavior: 'smooth',
		})
	}
}

const scrollPrev = (track, cardClass) => {
	if (track.scrollLeft <= 5) {
		track.scrollTo({
			left: track.scrollWidth,
			behavior: 'smooth',
		})
	} else {
		track.scrollBy({
			left: -getScrollAmount(track, cardClass),
			behavior: 'smooth',
		})
	}
}

sliders.forEach(slider => {
	if (!slider.track) return

	if (slider.nextBtn) {
		slider.nextBtn.addEventListener('click', () => {
			scrollNext(slider.track, slider.cardClass)
		})
	}

	if (slider.prevBtn) {
		slider.prevBtn.addEventListener('click', () => {
			scrollPrev(slider.track, slider.cardClass)
		})
	}

	if (slider.auto) {
		setInterval(() => {
			scrollNext(slider.track, slider.cardClass)
		}, 5500)
	}
})

//////////////FAQ////////////////

faqItems.forEach(item => {
	const question = item.querySelector('.flowerbox-faq__question')

	question.addEventListener('click', () => {
		const isActive = item.classList.contains('active')

		// zamknij wszystkie
		faqItems.forEach(faq => {
			faq.classList.remove('active')
		})

		// otwórz tylko kliknięte jeśli było zamknięte
		if (!isActive) {
			item.classList.add('active')
		}
	})
})

navBtn.addEventListener('click', handleNav)
navBtn.addEventListener('click', handleNav)
