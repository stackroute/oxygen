import React from 'react';

export default class FormStatement extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      subject: null,
      object: null,
      predicate: null
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.ready){
      this.setState({
        ready: true,
        subject: nextProps.subject,
        object: nextProps.object,
        predicate: nextProps.predicate,
      });
    }
  }

  render(){
    if(this.state.ready){

    }
    return null;
  }
}
