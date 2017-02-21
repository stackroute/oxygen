import React from 'react';
import TextField from 'material-ui/TextField';

export default class LoadProps extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      keyValue : this.props.keyvalue
    };
  }

  render(){
    return (
      <div>
        <TextField floatingLabelText='key' defaultValue={this.state.keyValue.key} style={{
            width: '40%',
            float: 'left',
            overflow: 'hidden'
        }}/>
        <TextField floatingLabelText='value' defaultValue={this.state.keyValue.value} style={{
            width: '40%'
        }}/>
      </div>
    )
  }
}
