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


////////sklep/////////////////////


const cartCounters = document.querySelectorAll(
	'.cart-mobile__count, .cart-desktop__count'
)

const getCart = () => JSON.parse(localStorage.getItem('cart')) || []

const saveCart = cart => {
	localStorage.setItem('cart', JSON.stringify(cart))
	updateCartCounter()
}

const getPriceNumber = price => {
	return Number(price.replace(/[^\d,.]/g, '').replace(',', '.'))
}

const updateCartCounter = () => {
	const cart = getCart()
	const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

	cartCounters.forEach(counter => {
		counter.textContent = totalQuantity
	})
}

const getProductData = button => {
	const card = button.closest('.product-card') || button.closest('.bestsellers__card')

	if (!card) return null

	const name =
		card.querySelector('.product-card__name') ||
		card.querySelector('h3')

	const price =
		card.querySelector('.product-card__price') ||
		card.querySelector('p')

	const img =
		card.querySelector('.product-card__img') ||
		card.querySelector('.bestsellers__img')

	if (!name || !price || !img) return null

	return {
		name: name.textContent.trim(),
		price: getPriceNumber(price.textContent),
		img: img.getAttribute('src'),
		quantity: 1,
	}
}


document.querySelectorAll('.add-to-cart').forEach(button => {
	button.addEventListener('click', () => {
		const product = getProductData(button)

		if (!product) return

		const cart = getCart()
		const existingProduct = cart.find(item => item.name === product.name)

		if (existingProduct) {
			existingProduct.quantity++
		} else {
			cart.push(product)
		}

		saveCart(cart)

		const oldText = button.textContent

		button.textContent = '✓'

		setTimeout(() => {
			button.textContent = oldText
		}, 1200)
	})
})

updateCartCounter()


///koszyk///

const cartItemsBox = document.querySelector('.cart-page__items')
const cartTotal = document.querySelector('.cart-page__total')
const clearCartBtn = document.querySelector('.cart-page__clear')

const removeProduct = productName => {
	const updatedCart = getCart().filter(item => item.name !== productName)

	saveCart(updatedCart)
	renderCartPage()
}

const renderCartPage = () => {
	if (!cartItemsBox || !cartTotal) return

	const cart = getCart()

	cartItemsBox.innerHTML = ''

	if (cart.length === 0) {
		cartItemsBox.innerHTML = '<p class="cart-page__empty">Twój koszyk jest pusty.</p>'
		cartTotal.textContent = '0 zł'
		return
	}

	let total = 0

	cart.forEach(item => {
		const productTotal = item.price * item.quantity
		total += productTotal

		const product = document.createElement('div')
		product.classList.add('cart-product')

		product.innerHTML = `
			<img src="${item.img}" alt="${item.name}">

			<div class="cart-product__info">
				<h2>${item.name}</h2>
				<p>Cena: ${item.price} zł</p>
				<span>Ilość: ${item.quantity}</span>
				<strong>Suma: ${productTotal} zł</strong>
			</div>

			<button class="cart-product__remove" data-name="${item.name}">
				Usuń
			</button>
		`

		cartItemsBox.append(product)
	})

	cartTotal.textContent = `${total} zł`
}

if (cartItemsBox) {
	cartItemsBox.addEventListener('click', e => {
		if (e.target.classList.contains('cart-product__remove')) {
			removeProduct(e.target.dataset.name)
		}
	})

	renderCartPage()
}

if (clearCartBtn) {
	clearCartBtn.addEventListener('click', () => {
		localStorage.removeItem('cart')
		updateCartCounter()
		renderCartPage()
	})
}

navBtn.addEventListener('click', handleNav)