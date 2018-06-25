// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import BookScreen from './bookScreen';


const mapStateToProps = state => {
	console.log('bookcontainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('bookDetailsMAPPINGDISPATCHTOPROPS');
	return {
		setClassChosen: classChosen => dispatch(Action.setClassChosen(classChosen)),
		setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
		setDependantsClasses: classes => dispatch(Action.setDependantsClasses(classes)),
	};
}

const BookContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(BookScreen);

export default BookContainer;
