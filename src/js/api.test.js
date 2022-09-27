const forms = document.querySelectorAll('form');
const message = {
	loading: './img/form/spinner.svg',
	success: 'Спасибо! Скоро мы с вами свяжемся',
	failure: 'Что-то пошло не так...'
};

forms.forEach(item => {
	postData(item);
});

function postData(form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		let statusMessage = document.createElement('img');
		statusMessage.src = message.loading;
		statusMessage.style.cssText = `
		display: block;
		margin: 0 auto;
		`;

		form.insertAdjacentElement('afterend', statusMessage);
		// form.appendChild(statusMessage);

		const request = new XMLHttpRequest();
		request.open('POST', '../../server.php');
		request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		const formData = new FormData(form);

		const object = {};
		formData.forEach(function (value, key) {
			object[key] = value;
		});
		const json = JSON.stringify(object);

		request.send(json);

		request.addEventListener('load', () => {
			if (request.status === 200) {
				console.log(request.response);
				showThanksModal(message.success);
				form.reset();
				statusMessage.remove();
			} else {
				showThanksModal(message.failure);
			}
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