import { closeModal, openModal } from "./modal";

const forms = () => {

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

	function showThanksModal(message, autoOpenModalWindow) {
		let prevModalDialog = document.querySelector('.modal__dialog');

		if (!prevModalDialog) {
			prevModalDialog = document.createElement('div');
			prevModalDialog.classList.add('modal__dialog');
		}
		prevModalDialog.classList.add('hide');
		openModal('.modal', autoOpenModalWindow);

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
			closeModal('.modal');
		}, 1000);
	};

	fetch('../../db.json')
		.then(data => data.json())
		.then(res => res);

};

export default forms;