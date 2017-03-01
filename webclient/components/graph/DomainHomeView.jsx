import React from 'react';
import TextField from 'material-ui/TextField';


export default class DomainHomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {


        }

    }


    render(){

        return (
        	<TextField
					hintText="Enter name of node"
					floatingLabelText="Add a new node"
					value = {this.state.addVal}
					onChange = {this.handleChange}
				/>


        )
    }
}
