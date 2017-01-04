import React from 'react';
import Paper from 'material-ui/Paper';
import SunburstView from './SunburstView';

export default class Domainhomeview extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {domainname: props.domainname};
  	}
  	render (){
		return <SunburstView />;
	}
}

Domainhomeview.propTypes = {
  webDoc: React.PropTypes.object
};
