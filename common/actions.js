/*
 * action types
 */
export const SET_GROUP = 'SET_GROUP'
// export const SET_VENUE = 'SET_VENUE'
export const SET_PERSON = 'SET_PERSON'
export const SET_PERSONS = 'SET_PERSONS'
// export const SET_TOKEN = 'SET_TOKEN'

/*
 * Action creators
 */
export function setGroup(group) {
	return { type: SET_GROUP, group }
}

// export function setVenue(venue) {
// 	return { type: SET_VENUE, venue }
// }
//
export function setPerson(person) {
	return { type: SET_PERSON, person }
}

export function setPersons(persons) {
	return { type: SET_PERSONS, persons }
}
//
// export function setToken(token) {
// 	return { type: SET_TOKEN, token };
// }

/*
 * Reducers
 */
export function Slb(state = {}, action) {
	console.log('HERE AT REDUCER', state, action);
	switch (action.type) {
		case SET_GROUP:
			return Object.assign({}, state, setGroup(action.group));

		// case SET_VENUE:
		// 	return Object.assign({}, state, setVenue(action.venue));
		//
		case SET_PERSON:
			return Object.assign({}, state, setPerson(action.person));

		case SET_PERSONS:
			return Object.assign({}, state, setPersons(action.persons));

		// case SET_TOKEN:
		// 	return Object.assign({}, state, setToken(action.token));
		//
		default:
			return state;
	}
}

