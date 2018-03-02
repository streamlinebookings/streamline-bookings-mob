// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import HomeScreen from './homeScreen';


const mapStateToProps = state => {
	console.log('homecontainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('homeMAPPINGDISPATCHTOPROPS');
	return {
		// setGroup: group => dispatch(Action.setGroup(group)),
		// setPerson: person => dispatch(Action.setPerson(person)),
		// setPersons: persons => dispatch(Action.setPersons(persons)),
		// setToken: token => dispatch(Action.setToken(token)),
		// setLocalDb: localDb => dispatch(Action.setLocalDb(localDb)),
	};
}

const HomeContainer = connect (
	mapStateToProps,
	mapDispatchToProps
)(HomeScreen);

export default HomeContainer;
