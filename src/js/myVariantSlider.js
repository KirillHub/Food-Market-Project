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

		const parentOfferBlockInner = document.querySelector(`.${this.parentOfferInner}`),
			slides = document.querySelectorAll(`.${this.parentOfferInner}`),
			parentOfferBlockWrapper = document.querySelector(`.${this.parentOfferBlockWrapper}`),
			width = window.getComputedStyle(parentOfferBlockWrapper).width;

		parentOfferBlockInner.style.width = 100 * this.dataJSON.length + '%';
		parentOfferBlockInner.style.display = 'flex';
		parentOfferBlockInner.style.transition = '0.5s all';

		slides.forEach(slide => slide.style.width = width);

		// parentOfferBlockWrapper.style.overflow = 'hidden'; // ! с этого места можно дальше плясать
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

		const offerSliderInner = document.querySelector('.offer__slider-inner'),
			nextSlider = document.querySelector('.offer__slider-next'),
			prevSlider = document.querySelector('.offer__slider-prev');

		console.log(offerSliderInner.childNodes);

		if (offerSliderInner.childNodes.keys('text')) {
			offerSliderInner.removeChild(offerSliderInner.firstChild);
		};

		let indexSlider = 1;

		console.log(offerSliderInner.childNodes);

		nextSlider.addEventListener('click', event => {
			if (event) {
				if (indexSlider > offerSliderInner.childElementCount) indexSlider = 1;
				if (indexSlider < 1) indexSlider = offerSliderInner.childElementCount;

				offerSliderInner.childNodes[indexSlider].classList.add('hide');
				offerSliderInner.childNodes[++indexSlider].classList.remove('hide');
			};
		});

		/*
					function plus(n) {
						slider(indexSlider += n);
					}
					function slider(n) {
						if (n > offerSliderInner.length) indexSlider = 1;
						if (n < 1) indexSlider = offerSliderInner.length;
		
						//  offerSliderInner.childNodes[n]
						offerSliderInner[indexSlider - 1].style.display = 'block';
					}
		*/

	});