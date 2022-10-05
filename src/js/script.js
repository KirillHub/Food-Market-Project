window.addEventListener('DOMContentLoaded', function () {

	// Tabs

	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}


	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});


	// Timer
	const deadline = '2022-10-25';

	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor((t / (1000 * 60 * 60 * 24))),
			seconds = Math.floor((t / 1000) % 60),
			minutes = Math.floor((t / 1000 / 60) % 60),
			hours = Math.floor((t / (1000 * 60 * 60) % 24));

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return '0' + num;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {

		const timer = document.querySelector(selector),
			days = timer.querySelector("#days"),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', deadline);

	//? Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

	// timelaps auto-open modal window
	const autoOpenModalWindow = setTimeout(openModal, 50000);

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		// modal.classList.toggle('show');
		document.body.style.overflow = 'hidden';
		clearInterval(autoOpenModalWindow)
	};

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		// modal.classList.toggle('show');
		document.body.style.overflow = '';

		if (modal.firstChild) {
			while (modal.childNodes.length >= 2) {
				modal.removeChild(modal.firstChild);
			}
		}

	};

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});

	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data__close') == '') {
			closeModal();
		}
	});

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight - 1) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll)
		}
	};

	window.addEventListener('scroll', showModalByScroll);


	const getResource = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}

		return await res.json();
	};


	//? Используем классы для карточек + fetch requests:
	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes || 'menu__item';
			this.parent = document.querySelector(parentSelector);
			this.transfer = 42;
			this.changeToUAH();
		};

		changeToUAH() {
			this.price = this.price * this.transfer;
		};

		render() {
			const element = document.createElement('div');

			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element)
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}

			element.innerHTML = `
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
			`;
			this.parent.append(element);
		};
	};

	/*
		getResource('http://localhost:3000/menu')
			.then(data => {
				data.forEach(({ img, altimg, title, descr, price }) => {
					new MenuCard(img, altimg, title, descr,
						price, '.menu .container').render();
				});
			});
	
	*/
	//? переключение слайдера с помощью библиотеки axios
	axios.get('http://localhost:3000/menu')
		.then(data => {
			data.data.forEach(({ img, altimg, title, descr, price }) => {
				new MenuCard(img, altimg, title, descr,
					price, '.menu .container').render();
			});
		});


	//? Forms

	const forms = document.querySelectorAll('form');
	const message = {
		loading: './img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {
		bindPostData(item);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: data
		});

		return await res.json()
	};

	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			let statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
			display: block;
			margin: 0 auto;
			`;

			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			/*
				const object = {};
				formData.forEach(function (value, key) {
					object[key] = value;
				});
			*/

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => data.text())
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					form.reset();
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure);
				}).finally(() => {
					form.reset();
				});
		});
	};

	function showThanksModal(message) {
		let prevModalDialog = document.querySelector('.modal__dialog');

		if (!prevModalDialog) {
			prevModalDialog = document.createElement('div');
			prevModalDialog.classList.add('modal__dialog');
		}
		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
		<div class="modal__content">
			<div class="modal__close">×</div>
				<div class="modal__title">
					${message}
				</div>
		</div> 
		`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 1000);
	};

	fetch('../../db.json')
		.then(data => data.json())
		.then(res => console.log(res));


	/*============================================================================================================*/
	//? переключение в слайдере:


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
		const res = await this.fetch(url);

		if (!res.ok) {
			throw new Error(`Please, check, something going wrong. Fetch err ${url} status ${res.status} 
				text -> ${res.statusText}`);
		}

		return await res.json();
	};

	getDataOfferBlock('http://localhost:3000/offerBlockImage')
		.then(dataOfferBlockFromJSON => {

			console.log(dataOfferBlockFromJSON);
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



	//? Calc
	const result = document.querySelector('.calculating__result span');
	let sex, height, weight, age, ratio;

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '____';
			return;
		};

		if (sex === 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age) * ratio));
		}
	};

	calcTotal();


	function getStaticInformation(parentSelector, activeClass) {
		const element = document.querySelectorAll(`${parentSelector} div`);

		document.querySelector(parentSelector).addEventListener('click', e => {
			if (e.target.getAttribute('data-ratio')) {
				ratio = +e.target.getAttribute('data-ratio');
			} else {
				sex = e.target.getAttribute('id');
			}

			element.forEach(elem => {
				elem.classList.remove(activeClass);
			});

			e.target.classList.add(activeClass);

			calcTotal();
		});
	}
	getStaticInformation('#gender', 'calculating__choose-item_active');
	getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');


	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', () => {
			switch (input.getAttribute('id')) {
				case 'height':
					height = +input.value;
					break;
				case 'weight':
					weight = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			};
			calcTotal();
		});

	};

	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');

});

