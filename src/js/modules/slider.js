const slider = () => {

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

		renderCards() {
			this.getTotal();

			const element = document.createElement('div');
			element.classList.add(`${this.parentOfferSlide}`);
			// element.classList.add(this.classes);

			if (this.classes.length !== 0) {
				this.classes.forEach(visibleClassStyle => {
					element.classList.add(visibleClassStyle)
				});
			};

			element.innerHTML = `<img src=${this.srcImg} alt=${this.altImg}>`;

			const parentElement = document.querySelector(`.${this.parentOfferInner}`);

			parentElement.append(element);
		};

		getWidthParentBlock() {
			// this.renderCards();

			const parentOfferBlockInner = document.querySelector(`.${this.parentOfferInner}`),
				parentOfferBlockWrapper = document.querySelector(`.${this.parentOfferBlockWrapper}`);

			parentOfferBlockInner.style.width = 100 * this.dataJSON.length + '%';
			parentOfferBlockInner.style.display = 'flex';
			parentOfferBlockInner.style.transition = '0.5s all';

			parentOfferBlockWrapper.style.overflow = 'hidden';
		};
	};

	const getDataOfferBlock = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Please, check, something going wrong. Fetch err ${url} status ${res.status} 
				text -> ${res.statusText}`);
		}

		return await res.json();
	};

	getDataOfferBlock('http://localhost:3000/offerBlockImage')
		.then(dataOfferBlockFromJSON => {

			dataOfferBlockFromJSON.forEach(({ img, altimg, current }, sliderOfficalndex) => {

				new SliderOfferBlock(
					img, altimg, current, 'offer__slider-wrapper', 'offer__slider-inner', 'offer__slide',
					dataOfferBlockFromJSON).getWidthParentBlock(); 	//! добавлять класс hide 
			});

		})
		.then(() => {
			let slideIndex = 1;
			let offset = 0;

			const slides = document.querySelectorAll('.offer__slide'),
				slider = document.querySelector('.offer__slider'),
				prev = document.querySelector('.offer__slider-prev'),
				next = document.querySelector('.offer__slider-next'),
				total = document.querySelector('#total'),
				current = document.querySelector('#current'),
				slidesWrapper = document.querySelector('.offer__slider-wrapper'),
				width = window.getComputedStyle(slidesWrapper).width,
				slidesField = document.querySelector('.offer__slider-inner');

			slides.forEach(slide => slide.style.width = replaceString(width));

			slider.style.position = 'relative';

			const indicators = document.createElement('ol'),
				dots = [];

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


			function replaceString(string) {
				return +Math.round(+string.slice(0, string.length - 2))
			};

			const dotStyles = (dots = []) => {
				dots.forEach(dot => dot.style.opacity = '.5');
				dots[slideIndex - 1].style.opacity = 1;
			};

			const sliderCurrentValues = (slides, slideIndex, total, current) => {
				if (slides.length < 10) {
					total.textContent = `0${slides.length}`;
					current.textContent = `0${slideIndex}`;
				} else {
					total.textContent = slides.length;
					current.textContent = slideIndex;
				};
			};


			for (let i = 0; i < slides.length; i++) {
				const dot = document.createElement('li');

				dot.setAttribute('data-slide-to', i + 1);
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
				if (i == 0) {
					dot.style.opacity = 1;
				}
				indicators.append(dot);
				dots.push(dot);
			}

			sliderCurrentValues(slides, slideIndex, total, current);

			next.addEventListener('click', () => {
				if (offset == replaceString(width) * (slides.length - 1)) {
					offset = 0;
				} else offset += replaceString(width);

				slidesField.style.transform = `translateX(-${offset}px)`;

				if (slideIndex == slides.length) {
					slideIndex = 1;
				} else slideIndex++;

				sliderCurrentValues(slides, slideIndex, total, current);

				dotStyles(dots);
			});

			prev.addEventListener('click', () => {
				if (offset == 0) {
					offset = replaceString(width) * (slides.length - 1);
				} else offset -= replaceString(width);

				slidesField.style.transform = `translateX(-${offset}px)`;

				if (slideIndex == 1) {
					slideIndex = slides.length;
				} else slideIndex--;

				sliderCurrentValues(slides, slideIndex, total, current);

				dotStyles(dots);
			});

			dots.forEach(dot => {
				dot.addEventListener('click', (e) => {
					const slideTo = e.target.getAttribute('data-slide-to');

					slideIndex = slideTo;
					offset = replaceString(width) * (slideTo - 1);

					slidesField.style.transform = `translateX(-${offset}px)`;

					if (slides.length < 10) {
						current.textContent = `0${slideIndex}`;
					} else current.textContent = slideIndex;

					dotStyles(dots);
				});

			});
		});

};

export default slider;