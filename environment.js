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

};
} else {
	// Development or otherwise non-prod
	envData = {
		env: 'development',
		localApiUrl: 'http://192.168.0.7:9057/api/',
		beApiUrl: 'https://streamlinebookings.com:9056/api/',
		imagesUrl: 'https://streamlinebookings.com:9056/imgs/',
	};
}

console.log('ENVIRONMENT', process.env.NODE_ENV, envData);

export const env = envData;

