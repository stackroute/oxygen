import React from 'react';
import Formsy from 'formsy-react';
import Request from 'superagent';
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
            domainName: '',
            nodeType: '',
            nodeName: '',
            errMsg: '',
            propertyList: null,
            open: false,
            canSubmit: false,
            openDialog: false,
            editModalOpen: false
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({editModalOpen: nextProps.open});
        this.getProperties(nextProps.nodeDetails);
    }
    getProperties = (nodeDetails) => {
        if (nodeDetails !== null) {
            this.setState({domainName: nodeDetails.domainName,
              nodeType: nodeDetails.nodeType,
              nodeName: nodeDetails.nodeName
            });
            let url = `/domain/${nodeDetails.domainName}/subject/${nodeDetails.nodeType}/${nodeDetails.nodeName}/objects`;
            Request.get(url).end((err, res) => {
                if (err) {
                    this.setState({errMsg: res.body});
                } else {
                    let response = JSON.parse(res.text);
                    let propertyList = response.attributes;
                    this.setState({propertyList: propertyList});
                }
            });
        }
    }

    handleModalClose = () => {
        this.setState({editModalOpen: false});
    }
    enableButton() {
        this.setState({canSubmit: true});
    }
    disableButton() {
        this.setState({canSubmit: false});
    }
    submitForm(data) {
        let editedData = JSON.stringify(data);
        console.log(editedData);
        console.log('Hi', this.state.nodeName);
        let url = `/domain/${this.state.nodeDetails.domainName}/subject/${this.state.nodeDetails.nodeType}/${this.state.nodeDetails.nodeName}`;
    }
    notifyFormError(data) {
        console.error('Form error:', data);
    }
    render() {
        let {paperStyle, switchStyle, submitStyle} = styles;
        let {wordsError, numericError, urlError} = errorMessages;
        let propertyList = this.state.propertyList;
        let keys = [];
        let formText = [];
        let formsyText = '';
        if (propertyList !== null) {
            keys = Object.keys(propertyList);
            keys.forEach(function(key) {
                if (key === 'desc' || key === 'context') {
                    formText.push(<FormsyText
                      name={key}
                      value={propertyList[key]}
                      validations='isWords'
                      validationsError={wordsError}
                      floatingLabelText={key}/>);
                    formText.push(<br/>);
                } else {
                    formText.push(<FormsyText
                      name={key}
                      value={propertyList[key]}
                      validationsError={wordsError}
                      disabled
                      floatingLabelText={key}/>);
                    formText.push(<br/>);
                }
            });
            formsyText = formText.map((element) => element);
        }
        return (
            <div>
                <Dialog title="Edit" titleStyle={{
                    color: "#858586",
                    fontSize: 30,
                    backgroundColor: "#c7c7c7"
                }} modal={true} open={this.state.editModalOpen}>
                    <Formsy.Form onValid={this.enableButton} onInvalid={this.disableButton} onValidSubmit={this.submitForm} onInvalidSubmit={this.notifyFormError}>
                        {formsyText}
                        <br/>
                        <FlatButton label="Submit" primary={true} style={submitStyle} type="submit" disabled={!this.state.canSubmit}/>
                        <FlatButton label="Cancel" primary={false} style={submitStyle} type="submit" onTouchTap={this.handleModalClose}/>
                    </Formsy.Form>
                </Dialog>
            </div>
        );
    }
}
