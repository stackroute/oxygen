import React from 'react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Request from 'superagent';
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
    urlError: "Please provide a valid URL",
}

export default class AddSubject extends React.Component {
    constructor(props) {
        super(props);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.state = {
            subjectType:"",
            subject:"",
            object:"",
            errMsg:"",
            open: false,
            canSubmit: false,
            openDialog: false,
            addmodalopen: false,
            domain: this.props.domain,
            subject: this.props.subject,
            object: this.props.object,
            subjectType:"",
            subjectNode:"",
            objectNode:"",
            objectType:""
        };
    }

    componentWillReceiveProps(nextProps){
      //console.log(this.props.domain);
      //console.log(this.props.subject);
      this.setState({
        addmodalopen: nextProps.open,
        domain: nextProps.domain,
        subject: nextProps.subject,
        object: nextProps.object

      });

    }

    enableButton() {
        this.setState({canSubmit: true});
    }

    disableButton() {
        this.setState({canSubmit: false});
    }

    submitForm(data) {
        console.log("Inside Add Subject Submit Form");

        // if(this.state.subject == undefined){
        //   console.log(this.state.subject);
        // }
        let str = ''
        str = this.state.subject;
        console.log("Str"+str);
        str = str.substr(3,str.length-1);
        console.log("Str"+str);
        let i = 0;
        let requestObj = {
          attributes : {},
          objects : [
            {
              name : '',
              predicates: [{
                name: '',
                direction: ''
              }]
            }
          ]
        }

        if(this.state.subject.charAt(0)=='C'){
          this.subjectType = "Concept";
          this.objectType = "Concept";
        } else if(this.state.subject.charAt(0)=='I'){
          this.subjectType = "Intent";
          this.objectType = "Term";
        }

        this.subjectNode = str;
        this.objectNode = data.object
        var objectName = `/domain/${this.state.domain}/object/${this.objectType}/${this.objectNode}`;

        requestObj.attributes[data.attributesName] = data.attributesValue;
        requestObj.objects[0]['name'] = objectName;
        requestObj.objects[0].predicates[0]['name'] = data.predicateName;
        requestObj.objects[0].predicates[0]['direction'] = data.direction;

        console.log(JSON.stringify(requestObj, null, 4));

        let url = `/domain/${this.state.domain}/subject/${this.subjectType}/${this.subjectNode}`;
        console.log(url);
        Request.put(url)
        .send(requestObj)
        .end((err, res) => {
          if (err) {
            console.log("err");
              this.setState({errmsg: res.body, loading: 'hide'});
          } else {
            console.log("Passing");
          }
        });
    }

    notifyFormError(data) {
        console.error('Form error:', data);
    }

    handleModalOpen = () => {
        this.setState({addmodalopen: true, canSubmit: false});
    }

    handleModalClose = () => {
      this.setState({addmodalopen: false});
    }

    handleClose = () => {
        this.setState({openDialog: true});
    };

    render() {
        let {paperStyle, switchStyle, submitStyle} = styles;
        let { wordsError, numericError, urlError } = errorMessages;
        return (
            <div>
              <Dialog
              title="Add"
              titleStyle={{
                color: "#858586",
                fontSize: 30,
                backgroundColor: "#c7c7c7"
            }}
              modal={true}
              open={this.state.addmodalopen}
              autoScrollBodyContent={true}>
                <Formsy.Form
                  onValid={this.enableButton}
                  onInvalid={this.disableButton}
                  onValidSubmit={this.submitForm}
                  onInvalidSubmit={this.notifyFormError}
                  >
                    <FormsyText name="object" validations="isWords" validationsError = {wordsError} hintText="object name" floatingLabelText="Object name"/>
                    <br/>
                      <FormsySelect name="objectType" required floatingLabelText="Select the object type" menuItems={this.selectFieldItems}>
                         <MenuItem value={'Intent'} primaryText="Intent"/>
                         <MenuItem value={'Concept'} primaryText="Concept"/>
                     </FormsySelect>
                     <br/>
                     <FormsyText name="attributesName" validations="isWords" validationsError = {wordsError} hintText="attributes name" floatingLabelText="attributes name"/>
                     <br/>
                    <FormsyText name="attributesValue" validations="isWords" validationsError = {wordsError} hintText="attributes value" floatingLabelText="attributes value"/>
                     <br/>
                    <FormsyText name="predicateName" validations="isWords" validationsError = {wordsError} hintText="Predicate Name" floatingLabelText="Predicate Name"/>
                    <br/>
                    <FormsyText name="direction" validations="isWords" validationsError = {wordsError} hintText="Direction" floatingLabelText="Direction"/>
                    <br/>
                    <FlatButton label = "Add"
                       primary = {true}
                       style={submitStyle}
                              type="submit"
                       disabled = {
                              !this.state.canSubmit
                          }
                    />
                   <FlatButton label = "Cancel"
                      primary = {true}
                      style={submitStyle}
                      onTouchTap = {
                            this.handleModalClose
                        }
                    />
              </Formsy.Form>
                </Dialog>
            </div>
        );
    }
}
