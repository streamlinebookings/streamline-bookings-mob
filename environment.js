/*
 * Environment dependant variables
 */

let envData = {};

if (process.env.NODE_ENV === 'production') {
	// Production
	envData = {
		beApiUrl: 'https://streamlinebookings.com:9056/api',
		imagesUrl: 'https://streamlinebookings.com:9056/imgs/',

};
} else {
	// Development or otherwise non-prod
	envData = {
		localApiUrl: 'http://192.168.0.6:9057/api/',
		beApiUrl: 'https://streamlinebookings.com:9056/api',
		imagesUrl: 'https://streamlinebookings.com:9056/imgs/',
	};
}

console.log('ENVIRONMENT', process.env.NODE_ENV, envData);

export const env = envData;

