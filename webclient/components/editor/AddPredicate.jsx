import React from 'react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';



   const styles = {
     div: {
      width : 10,
       margin: 10,
       padding: 20,
     },
     switchStyle: {
       marginBottom: 16,
     },
     submitStyle: {
       marginTop: 32,
     },
   }
export default class AddPredicate extends React.Component {
  constructor(props) {
    super(props);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.state =  {
      domains:[],
        errMsg:'',
        open: false,
      canSubmit: false,
      openDialog: false,
    };
  }

  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton() {
    this.setState({
      canSubmit: false,
    });
  }

  submitForm(data) {
    alert(JSON.stringify(data, null, 4));
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  handleClose = () => {
    this.setState({openDialog : true});
  };

  render() {
    let {paperStyle, switchStyle, submitStyle } = styles;

    return (
        <div>
          <Formsy.Form
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submitForm}
          >

        <br />

            <FormsyText
              name="Predicate"
              validations="isWords"
              required
              hintText="Predicate name"
              floatingLabelText="Predicate"
            />
          </Formsy.Form>
        </div>
    );
  }
}
