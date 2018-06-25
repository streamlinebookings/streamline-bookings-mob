/*
 * action types
 */
export const SET_GROUP = 'SET_GROUP'
export const SET_PERSON = 'SET_PERSON'
export const SET_PERSONS = 'SET_PERSONS'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_VENUE = 'SET_VENUE'
export const SET_LOCALDB = 'SET_LOCALDB'
export const SET_CARERCHOSEN = 'SET_CARERCHOSEN'
export const SET_DEPENDANTSCHOSEN = 'SET_DEPENDANTSCHOSEN'
export const SET_DEPENDANTSCLASSES = 'SET_DEPENDANTSCLASSES'
export const SET_CLASSCHOSEN = 'SET_CLASSCHOSEN'
export const SET_VENUECHOSEN = 'SET_VENUECHOSEN'
export const SET_PAYMENTMETHODCHOSEN = 'SET_PAYMENTMETHODCHOSEN'

/*
 * Action creators
 */
export function setGroup(group) {
	return { type: SET_GROUP, group }
}
export function setPerson(person) {
	return { type: SET_PERSON, person }
}
export function setPersons(persons) {
	return { type: SET_PERSONS, persons }
}
export function setToken(token) {
	return { type: SET_TOKEN, token };
}
export function setVenue(venue) {
	return { type: SET_VENUE, venue };
}
export function setLocalDb(localDb) {
	return { type: SET_LOCALDB, localDb };
}
export function setCarerChosen(carerChosen) {
	return { type: SET_CARERCHOSEN, carerChosen };
}
export function setDependantsChosen(dependantsChosen) {
	return { type: SET_DEPENDANTSCHOSEN, dependantsChosen };
}
export function setDependantsClasses(dependantsClasses) {
	return { type: SET_DEPENDANTSCLASSES, dependantsClasses };
}
export function setClassChosen(classChosen) {
	return { type: SET_CLASSCHOSEN, classChosen };
}
export function setVenueChosen(venueChosen) {
	return { type: SET_VENUECHOSEN, venueChosen };
}
export function setPaymentMethodChosen(paymentMethodChosen) {
	return { type: SET_PAYMENTMETHODCHOSEN, paymentMethodChosen };
}

/*
 * Reducers
 */
export function Slb(state = {}, action) {
	console.log('HERE AT REDUCER', state, action);
	switch (action.type) {
		case SET_GROUP:
			return Object.assign({}, state, setGroup(action.group));

		case SET_PERSON:
			return Object.assign({}, state, setPerson(action.person));

		case SET_PERSONS:
			return Object.assign({}, state, setPersons(action.persons));

		case SET_TOKEN:
			return Object.assign({}, state, setToken(action.token));

		case SET_VENUE:
			return Object.assign({}, state, setVenue(action.venue));

		case SET_LOCALDB:
			return Object.assign({}, state, setLocalDb(action.localDb));

		case SET_CARERCHOSEN:
			return Object.assign({}, state, setCarerChosen(action.carerChosen));

		case SET_DEPENDANTSCHOSEN:
			return Object.assign({}, state, setDependantsChosen(action.dependantsChosen));

		case SET_DEPENDANTSCLASSES:
			return Object.assign({}, state, setDependantsClasses(action.dependantsClasses));

		case SET_CLASSCHOSEN:
			return Object.assign({}, state, setClassChosen(action.classChosen));

		case SET_VENUECHOSEN:
			return Object.assign({}, state, setVenueChosen(action.venueChosen));

		case SET_PAYMENTMETHODCHOSEN:
			return Object.assign({}, state, setPaymentMethodChosen(action.paymentMethodChosen));

		default:
			return state;
	}
}

