/*
 * Environment dependant variables
 */

/*

FZ Sandbox credentials below:
Username: TESTstreamlinebookings
Token: 3df4b3bb71a31aa13bb2994ea04540c2bcd1f805
Shared Secret: cdff656ed7


 */

let Buffer = require('buffer').Buffer;

let envData = {};

if (process.env.NODE_ENV === 'production') {
	// Production
	envData = {
		env: 'production',
		beApiUrl: 'https://streamlinebookings.com:9056/api/',
		imagesUrl: 'https://streamlinebookings.com:9056/imgs/',

		// FatZebra
		payGateUrl: 'https://gateway.sandbox.fatzebra.com.au/v1.0/',
		payGateAuth: 'Basic ' + Buffer.from('TESTstreamlinebookings:3df4b3bb71a31aa13bb2994ea04540c2bcd1f805').toString('base64'),

		// JudoPay
		// payGateUrl: 'https://gw1.judopay-sandbox.com/',
		// payGateAuth: 'Basic ' + Buffer.from('CXqeHXubEnhgpz0L:a4024f6285af0e64096b5e0e6ae736d210a69dc14b7a562db17dc45d4829c2f7').toString('base64'),
		// payGateId: '100236-439',
	};

} else {
	// Development or otherwise non-prod
	envData = {
		env: 'development',
		localApiUrl: 'http://192.168.0.4:9057/api/',
		beApiUrl: 'https://streamlinebookings.com:9056/api/',
		imagesUrl: 'https://streamlinebookings.com:9056/imgs/',

		// FatZebra
		payGateUrl: 'https://gateway.sandbox.fatzebra.com.au/v1.0/',
		payGateAuth: 'Basic ' + Buffer.from('TESTstreamlinebookings:3df4b3bb71a31aa13bb2994ea04540c2bcd1f805').toString('base64'),

		// JudoPay
		// payGateUrl: 'https://gw1.judopay-sandbox.com/',
		// payGateAuth: 'Basic ' + Buffer.from('CXqeHXubEnhgpz0L:a4024f6285af0e64096b5e0e6ae736d210a69dc14b7a562db17dc45d4829c2f7').toString('base64'),
		// payGateId: '100236-439',
	};
}

console.log('ENVIRONMENT', process.env.NODE_ENV, envData);

export const env = envData;




