import React from 'react';
import Formsy from 'formsy-react';
import Request from 'superagent';

export default class EditNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDomain: '',
            propertyObject: null
        }
    }

    componentWillReceiveProps(nextProps) {
      console.log('Hi all',nextProps);
        // console.log('Hello Jaga',nextProps.domainName);
        // console.log('Hello',nextProps.property);
        this.setState({selectedDomain: nextProps.domainName, propertyObject: nextProps.property});
    }

    render() {
        return (
            <div>
                <p>
                    {this.state.selectedDomain}
                </p>
            </div>
        );
    }
}
