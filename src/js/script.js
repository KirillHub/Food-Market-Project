import tabs from './modules/tabs';
import modal from './modules/modal';
import timer from './modules/timer';
import cards from './modules/cards';
import calculator from './modules/calculator';
import forms from './modules/forms';
import slider from './modules/slider';
import { openModal } from './modules/modal';


window.addEventListener('DOMContentLoaded', function () {

	const autoOpenModalWindow = setTimeout(() => openModal('.modal', autoOpenModalWindow), 50000);

	tabs();
	modal('[data-modal]', '.modal', autoOpenModalWindow);
	timer();
	cards();
	calculator();
	forms(autoOpenModalWindow);
	slider();

});


