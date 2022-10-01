/*
class Configstore {
	constructor(id, defaults, options = {}) {
		const pathPrefix = options.globalConfigPath ?
			path.join(id, 'config.json') :
			path.join('configstore', `${id}.json`);

		this.path = options.configPath || path.join(configDirectory, pathPrefix);

		if (defaults) {
			this.all = {
				...defaults,
				...this.all
			};
		}
	}

*/


class Configstore {
	constructor(id, defaults, options = {},
		array = [...arguments].filter(item => item !== new Number())) {
		const all = {
			...defaults,
			...array
		};

		console.log(all);
	}
}

const objecty = new Configstore(32,
	'lolevy skdkkd dkdkdk',
	{ 21: 23 }, [323232, 32323, 232323, 2323, 23, 23, 23]
);

console.log(objecty);