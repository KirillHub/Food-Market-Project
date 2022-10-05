const result = document.querySelector('.calculating__result span'),
	choosedMaleParentBlock = document.querySelector('.calculating__choose'),
	calculatingChooseMediumParent = document.querySelector('.calculating__choose_medium'),
	physicallyActiveChoose = document.querySelector('.calculating__choose_big');


function calculateCalories(choosedMaleParent = []) {

	choosedMaleParent.forEach(item => {

		item.addEventListener('click', e => {

			choosedMaleParent.forEach(childrenItems => {
				if (childrenItems.tagName === 'DIV'
					&& childrenItems.classList.contains('calculating__choose-item_active')) {
					childrenItems.classList.remove('calculating__choose-item_active');
					e.target.classList.add('calculating__choose-item_active');
				};
			});
			localStorage.setItem('choosedMale', e.target.id)

		});
	});
};


function calculatingConfiguration(calculatingChooseMediumParent) {
	calculatingChooseMediumParent.childNodes.forEach(childInput => {
		if (childInput.tagName === 'INPUT') {

			if (childInput.textContent === '' &&
				(localStorage.getItem('userHeight') ||
					localStorage.getItem('userWeight') ||
					localStorage.getItem('userAge'))) {
				localStorage.removeItem('userHeight');
				localStorage.removeItem('userWeight');
				localStorage.removeItem('userAge');
			}

			childInput.addEventListener('change', event => {

				if (event.target.id === 'height') {
					localStorage.setItem('userHeight', event.target.value);
				};

				if (event.target.id === 'weight') {
					localStorage.setItem('userWeight', event.target.value);
				};

				if (event.target.id === 'age') {
					localStorage.setItem('userAge', event.target.value);
				};

			});
		}
	});
};


function getPhysicallyActiveChoose(physicallyActiveChoose) {
	physicallyActiveChoose.forEach(physicallyActiveChooseItem => {

		physicallyActiveChooseItem.addEventListener('click', event => {

			physicallyActiveChoose.forEach(item => {
				if (item.tagName === 'DIV'
					&& item.classList.contains('calculating__choose-item_active')) {
					item.classList.remove('calculating__choose-item_active');
					event.target.classList.add('calculating__choose-item_active');

					const dataRationValue = event.target.getAttribute('data-ratio');
					localStorage.setItem('dataRationValue', dataRationValue);
				};
			});

		});

	});
};

getPhysicallyActiveChoose(physicallyActiveChoose.childNodes);
calculateCalories(choosedMaleParentBlock.childNodes);
calculatingConfiguration(calculatingChooseMediumParent)


const calculateDailyCalorieIntake = (result) => {

	const localStorageData = localStorage;
	const calcMainField = document.querySelector('.calculating__field');

	calcMainField.childNodes.forEach(item => {
		item.addEventListener('click', e => {
			if (e) {
				let userMale = localStorageData.getItem('choosedMale');
				let userConfiguration = {
					'height': localStorageData.getItem('userHeight'),
					'weight': localStorageData.getItem('userWeight'),
					'age': localStorageData.getItem('userAge'),
				};
				let userActive = localStorageData.getItem('dataRationValue');

				if (userMale === 'male') {
					let normCal = 88.36 + (13.4 * +userConfiguration.weight) +
						(4.8 * (+userConfiguration.height)
							- (5.7 * +userConfiguration.age));
					let dailyRate = Math.round(normCal * +userActive);

					result.innerHTML = dailyRate;
				};

				if (userMale === 'female') {
					let normCal = 447.6 + (9.2 * +userConfiguration.weight) +
						(3.1 * (+userConfiguration.height)
							- (4.3 * +userConfiguration.age));
					let dailyRate = Math.round(normCal * +userActive);

					result.innerHTML = dailyRate;
				}
			}
		})
	})
};
calculateDailyCalorieIntake(result);