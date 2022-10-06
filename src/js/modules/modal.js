
function openModal(modalSelector, autoOpenModalWindow) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add('show');
	modal.classList.remove('hide');
	// modal.classList.toggle('show');
	document.body.style.overflow = 'hidden';

	//TODO: fix this!
	console.log(autoOpenModalWindow);
	if (autoOpenModalWindow) clearInterval(autoOpenModalWindow);
};

function closeModal(modalSelector) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add('hide');
	modal.classList.remove('show');
	// modal.classList.toggle('show');
	document.body.style.overflow = '';
};


const modal = (triggerSelector, modalSelector, autoOpenModalWindow) => {

	const modalTrigger = document.querySelectorAll(triggerSelector),
		modal = document.querySelector(modalSelector);

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', () => openModal(modalSelector, autoOpenModalWindow));
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal(modalSelector);
		}
	});

	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data__close') == '') {
			closeModal(modalSelector);
		}
	});

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight - 1) {
			openModal(modalSelector, autoOpenModalWindow);
			window.removeEventListener('scroll', showModalByScroll)
		}
	};

	window.addEventListener('scroll', showModalByScroll);
};

export default modal;
export { closeModal, openModal };