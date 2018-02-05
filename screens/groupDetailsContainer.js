// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import GroupDetailsScreen from './groupDetailsScreen';


const mapStateToProps = state => {
	console.log('groupDetailsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('groupDetailsMAPPINGDISPATCHTOPROPS');
	return {
		setGroup: group => dispatch(Action.setGroup(group)),
	};
}

const GroupDetailsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(GroupDetailsScreen);

export default GroupDetailsContainer;
