// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import LoginScreen from './loginScreen';


const mapStateToProps = state => {
	console.log('logincontainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('loginMAPPINGDISPATCHTOPROPS');
	return {
		setGroup: group => dispatch(Action.setGroup(group)),
		setPerson: person => dispatch(Action.setPerson(person)),
		setPersons: persons => dispatch(Action.setPersons(persons)),
		setToken: token => dispatch(Action.setToken(token)),
		setVenue: venue => dispatch(Action.setVenue(venue)),
		setLocalDb: localDb => dispatch(Action.setLocalDb(localDb)),
	};
}

const LoginContainer = connect (
	mapStateToProps,
	mapDispatchToProps
)(LoginScreen);

export default LoginContainer;
