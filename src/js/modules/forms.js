import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

const forms = (formSelector, autoOpenModalWindow) => {

	const forms = document.querySelectorAll(formSelector),
		inputs = document.querySelectorAll('form input');

	// validate form
	const validateInputs = (inputs) => {

		//clear all warnings
		const checkEmptyInput = (input) => {
			input.style.border = 'none';
			input.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.2)';
			input.style.background = '#FFFFFF';

			messageMistakeInput.classList.add('hide');
		};

		const messageMistakeInputValue = 'Введите пожалуйста цифры';

		const messageMistakeInput = document.createElement('div');
		messageMistakeInput.textContent = messageMistakeInputValue;
		messageMistakeInput.style.cssText = `
		width: 210px;
		padding: 0px 0px 10px 0px;
		margin: 0 auto;
		`;
		messageMistakeInput.style.textAlign = 'center';
		messageMistakeInput.classList.add('valid-form', 'hide');

		inputs.forEach(input => {

			if (input.hasAttribute('data-tel')) {
				input.addEventListener('input', e => {

					if (!/^[0-9]+$/.test(input.value) || input.value.length > 12) {

						if (input.value === '') return checkEmptyInput(input);

						input.style.border = '1px solid rgba(255, 0, 0, 0.3)';
						input.style.boxShadow = '4px 4px 15px  rgba(255, 0, 0, 0.4)';

						messageMistakeInput.classList.remove('hide');

						input.insertAdjacentElement('afterend', messageMistakeInput);
					} else checkEmptyInput(input);

				});
			}
		});
	};

	validateInputs(inputs);

	const message = {
		loading: './img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => bindPostData(item));



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

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
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
		};

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
			prevModalDialog.classList.remove('hide');
			closeModal('.modal');
		}, 2000);
	};

};

export default forms;