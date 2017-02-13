import React from 'react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {
    FormsyCheckbox,
    FormsyDate,
    FormsyRadio,
    FormsyRadioGroup,
    FormsySelect,
    FormsyText,
    FormsyTime,
    FormsyToggle,
    FormsyAutoComplete
} from 'formsy-material-ui/lib';
const styles = {
    div: {
        width: 10,
        margin: 10,
        padding: 20
    },
    switchStyle: {
        marginBottom: 16
    },
    submitStyle: {
        marginTop: 32
    }
};
const errorMessages = {
    wordsError: "Please only use letters",
    numericError: "Please provide a number",
    urlError: "Please provide a valid URL"
}
export default class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.state = {
            subjectType: "",
            subject: "",
            object: "",
            errMsg: "",
            open: false,
            canSubmit: false,
            openDialog: false,
            editmodalopen: false
        };
    }
    componentWillReceiveProps(nextProps) {
        console.log(this.nextProps);
        this.setState({editmodalopen: nextProps.open})
    }
    handleModalEditOpen = () => {
        this.setState({editmodalopen: true});
    };
    handleModalClose = () => {
        this.setState({editmodalopen: false});
    }
    // handleSubmit(data) {
    //     console.log('handling submit for adding intent');
    //     let sub = this.state.subject;
    //     sub = sub.replace(/\b[a-z]/g, function(f) {
    //         return f.toUpperCase();
    //     });
    //
    //     let subject = {
    //         subject: sub,
    //         object: this.state.object
    //     };
    //     this.setState({subject: subject})
    //     this.setState({})
    //
    // }
    enableButton() {
        this.setState({canSubmit: true});
    }
    disableButton() {
        this.setState({canSubmit: false});
    }
    submitForm(data) {
        console.log(JSON.stringify(data, null, 4));
    }
    notifyFormError(data) {
        console.error('Form error:', data);
    }
    handleModalOpen = () => {
        this.setState({editmodalopen: true, canSubmit: false});
    }
    handleModalClose = () => {
        this.setState({editmodalopen: false});
    }
    handleClose = () => {
        this.setState({openDialog: true});
    };
    render() {
        let {paperStyle, switchStyle, submitStyle} = styles;
        let {wordsError, numericError, urlError} = errorMessages;
        return (
            <div>
                <Dialog title="Edit" titleStyle={{
                    color: "#858586",
                    fontSize: 30,
                    backgroundColor: "#c7c7c7"
                }} modal={true} open={this.state.editmodalopen}>
                    <Formsy.Form onValid={this.enableButton} onInvalid={this.disableButton} onValidSubmit={this.submitForm} onInvalidSubmit={this.notifyFormError}>
                        <FormsyText name="Properties"
                          validations="isWords"
                          validationsError={wordsError}
                          required
                          floatingLabelText="Properties"/>
                        <br/>
                        <FlatButton label="Submit"
                          primary={true}
                          style={submitStyle}
                          type="submit"
                          disabled={!this.state.canSubmit}/>
                        <FlatButton label="Cancel"
                          primary={true}
                          style={submitStyle}
                          type="submit"
                          onTouchTap={this.handleModalClose}/>
                    </Formsy.Form>
                </Dialog>
            </div>
        );
    }
}
