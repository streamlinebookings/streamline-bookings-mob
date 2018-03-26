/*
 * Environment dependant variables
 */

let envData = {};

if (process.env.NODE_ENV === 'production') {
	// Production
	envData = {
		env: 'production',
		beApiUrl: 'https://streamlinebookings.com:9056/api/',
		imagesUrl: 'https://streamlinebookings.com:9056/imgs/',
		payGateUrl: 'https://gw1.judopay-sandbox.com/',
		payGateAuth: 'Basic ' + btoa('CXqeHXubEnhgpz0L:a4024f6285af0e64096b5e0e6ae736d210a69dc14b7a562db17dc45d4829c2f7'),
		payGateId: '100236-439',
	};

} else {
	// Development or otherwise non-prod
	envData = {
		env: 'development',
		localApiUrl: 'http://192.168.0.2:9057/api/',
		beApiUrl: 'https://streamlinebookings.com:9056/api/',
		imagesUrl: 'https://streamlinebookings.com:9056/imgs/',
		payGateUrl: 'https://gw1.judopay-sandbox.com/',
		payGateAuth: 'Basic ' + btoa('CXqeHXubEnhgpz0L:a4024f6285af0e64096b5e0e6ae736d210a69dc14b7a562db17dc45d4829c2f7'),
		payGateId: '100236-439',
	};
}

console.log('ENVIRONMENT', process.env.NODE_ENV, envData);

export const env = envData;

