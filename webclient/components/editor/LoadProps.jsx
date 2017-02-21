import React from 'react';
import TextField from 'material-ui/TextField';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';

export default class LoadProps extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      keyValue : this.props.keyvalue,
      propertyCount: this.props.propsCount
    };
  }

  render(){
    return (
      <div>
        <FormsyText floatingLabelText='key' name={this.state.propertyCount}style={{
            width: '40%',
            float: 'left',
            overflow: 'hidden'
        }}/>
      <FormsyText floatingLabelText='value' defaultValue={this.state.keyValue.value} style={{
            width: '40%'
        }}/>
      </div>
    )
  }
}
