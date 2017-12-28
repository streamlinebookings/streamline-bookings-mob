// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
// import * as Action from '../common/actions';
import BookDetailsScreen from './bookDetailsScreen';


const mapStateToProps = state => {
	console.log('bookDetailscontainerMAPPINGSTATETOPROPS', state);
	return state;
}

// const mapDispatchToProps = dispatch => {
// 	console.log('bookDetailsMAPPINGDISPATCHTOPROPS');
// 	return {
// 		setClassChosen: classChosen => dispatch(Action.setClassChosen(classChosen)),
// 		setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
// 	};
// }

const BookDetailsContainer = connect (
	mapStateToProps,
	// mapDispatchToProps,
)(BookDetailsScreen);

export default BookDetailsContainer;
