import React from 'react';
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
