/*
! html:

  <div class="offer__slider">
					 <div class="offer__slider-counter">
						  <div class="offer__slider-prev">
								<img src="icons/left.svg" alt="prev">
						  </div>
						  <span id="current">01</span>
						  /
						  <span id="total">04</span>
						  <div class="offer__slider-next">
								<img src="icons/right.svg" alt="next">
						  </div>
					 </div>
					 <div class="offer__slider-wrapper">
						  <div class="offer__slider-inner">
						  </div>
					 </div>
				</div>
*/



class SliderOfferBlock {
	constructor(srcImg, altImg, current, parentOfferBlockWrapper, parentOfferInner,
		parentOfferSlide, dataJSON, ...classes) {

		this.srcImg = srcImg;
		this.altImg = altImg;
		this.current = current;
		this.total = dataJSON.length;

		this.dataJSON = dataJSON;

		this.parentOfferBlockWrapper = parentOfferBlockWrapper;
		this.parentOfferInner = parentOfferInner;
		this.parentOfferSlide = parentOfferSlide;

		this.classes = classes || '.hide';
	};

	getTotal() {
		if (this.dataJSON.length < 10) {
			this.total = "0" + this.dataJSON.length
		} else this.total = this.dataJSON.length;
	};

	/*
	getCurrent() {
		this.dataJSON.forEach((item, indexData) => {
			console.log(item);

			this.current = "0" + indexData;
		})
	};
	*/

	renderCards() {
		this.getTotal();

		const element = document.createElement('div');
		element.classList.add(`${this.parentOfferSlide}`);
		element.classList.add(this.classes);
		// element.style.position = 'relative';

		if (this.classes.length !== 0) {
			this.classes.forEach(visibleClassStyle => {
				element.classList.add(visibleClassStyle)
			});
		};

		element.innerHTML = `<img src=${this.srcImg} alt=${this.altImg}>`;

		const parentElement = document.querySelector(`.${this.parentOfferInner}`);

		// if (parentElement.childNodes.keys('text')) {
		// 	parentElement.removeChild(parentElement.firstChild);
		// };
		parentElement.append(element);
	};

	getWidthParentBlock() {
		this.renderCards();

		/*
		! с этого места можно дальше плясать

		  ?	 1. Для этого варианта this.renderCards()нужно выключать!

		const parentOfferBlockInner = document.querySelector(`.${this.parentOfferInner}`),
			slides = document.querySelectorAll(`.${this.parentOfferSlide}`),
			parentOfferBlockWrapper = document.querySelector(`.${this.parentOfferBlockWrapper}`),
			width = window.getComputedStyle(parentOfferBlockWrapper).width;

		parentOfferBlockInner.style.width = 100 * this.dataJSON.length + '%';
		parentOfferBlockInner.style.display = 'flex';
		parentOfferBlockInner.style.transition = '0.5s all';

		slides.forEach(slide => slide.style.width = width);

		parentOfferBlockWrapper.style.overflow = 'hidden';
		*/
	};

};


const getDataOfferBlock = async (url) => {
	const res = await this.fetch(url);

	if (!res.ok) {
		throw new Error(`Please, check, something going wrong. Fetch err ${url} status ${res.status} 
			text -> ${res.statusText}`);
	}

	return await res.json();
};

getDataOfferBlock('http://localhost:3000/offerBlockImage')
	.then(dataOfferBlockFromJSON => {
		const current = document.querySelector('#current');

		dataOfferBlockFromJSON.forEach(({ img, altimg, current }, sliderOfficalndex) => {

			new SliderOfferBlock(
				img, altimg, current, 'offer__slider-wrapper', 'offer__slider-inner', 'offer__slide',
				dataOfferBlockFromJSON, 'hide').getWidthParentBlock(); 	//! добавлять класс hide 

			if (sliderOfficalndex === 0) {
				document.querySelector('.offer__slide').classList.remove('hide');
			}

		});

	})
	.then(() => {

		const slides = document.querySelectorAll('.offer__slide'),
			nextSlider = document.querySelector('.offer__slider-next'),
			prevSlider = document.querySelector('.offer__slider-prev'),
			total = document.querySelector('#total'),
			current = document.querySelector('#current');

		let indexSlider = 1;
		const slider = document.querySelector('.offer__slider'),
			indicators = document.createElement('ol'),
			arrayOfDots = new Array();

		slider.style.position = 'relative';

		if (slides.length < 10) {
			total.textContent = `0${slides.length}`;
			current.textContent = `0${indexSlider}`;
		} else {
			total.textContent = slides.length;
			current.textContent = indexSlider;
		}

		indicators.classList.add('carousel-indicators');
		indicators.style.cssText = `
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 15;
			display: flex;
			justify-content: center;
			margin-right: 15%;
			margin-left: 15%;
			list-style: none;
		`;
		slider.append(indicators);


		slides.forEach((slide, slideIndex) => {
			slide.setAttribute('data-slide-to', slideIndex++);
			slide.style.transition = '0.5s all';

			const dot = document.createElement('li');
			dot.setAttribute('data-slide-dot', slideIndex++);
			dot.style.cssText = `
				box-sizing: content-box;
				flex: 0 1 auto;
				width: 30px;
				height: 6px;
				margin-right: 3px;
				margin-left: 3px;
				cursor: pointer;
				background-color: #fff;
				background-clip: padding-box;
				border-top: 10px solid transparent;
				border-bottom: 10px solid transparent;
				opacity: .5;
				transition: opacity .6s ease;
			`;

			if (slideIndex == 0) {
				dot.style.opacity = 1;
			};
			indicators.append(dot);
			arrayOfDots.push(dot);
		});

		nextSlider.addEventListener('click', () => {
			const slideAttributeIndex = slides[indexSlider].getAttribute('data-slide-to');

			if (indexSlider == slides.length - 1) {
				indexSlider = 0;
			} else indexSlider++;

			if (slides.length < 10) {

				if (indexSlider === 0) {
					current.textContent = `0${slides.length}`
				} else {
					current.textContent = `0${indexSlider}`
				};

			} else current.textContent = indexSlider;

			toggleClassNames(slides, slideAttributeIndex);
		});


		prevSlider.addEventListener('click', () => {

			if (indexSlider == 0) {
				indexSlider = slides.length - 1;
			} else {
				indexSlider--;
			}

			let slideAttributeIndex = slides[indexSlider].getAttribute('data-slide-to');

			if (slides.length < 10) {

				if (indexSlider === 0) {
					current.textContent = `0${slides.length}`;
				} else {
					current.textContent = `0${indexSlider}`
				};

			} else current.textContent = indexSlider;

			toggleClassNames(slides, slideAttributeIndex);
		});

		//array of dot
		console.log(arrayOfDots);
		arrayOfDots.forEach(dot => {
			dot.addEventListener('click', (e) => {
				const sliderDotIndex = e.target.getAttribute('data-slide-dot');

				slideIndex = sliderDotIndex;

				toggleClassNames(slides, sliderDotIndex);

				if (slides.length < 10) {
					current.textContent = `0${slideIndex}`;
				} else {
					current.textContent = slideIndex;
				};
				arrayOfDots.forEach(dot => dot.style.opacity = '.5');
				arrayOfDots[slideIndex - 1].style.opacity = 1;
			});
		});

		// toggle
		function toggleClassNames(slides, slideAttributeIndex) {
			slides.forEach((slide, indexSlide) => {

				if (indexSlide == slideAttributeIndex) {
					slide.classList.remove('hide')
				} else {
					slide.classList.add('hide')
				}
			});
		}

	});



	});