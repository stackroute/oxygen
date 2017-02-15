import React from 'react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import Request from 'superagent';

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
export default class DeleteNode extends React.Component {
  constructor(props) {
    super(props);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.getOrphans = this.getOrphans.bind(this);
    this.state =  {
      errMsg:'',
      open: false,
      canSubmit: false,
      openDialog: false,
      nodeDetails: null,
      orphans: []
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      open: nextProps.open,
      //nodeDetails: nextProps.nodeDetails
    });
    this.getOrphans(nextProps.nodeDetails);
  }

  getOrphans(nodeDetails){
    if(nodeDetails !== null){
      let url = `domain/${nodeDetails.domainName}/subject/${nodeDetails.nodetype}/${nodeDetails.nodename}`;
      Request.get(url).end((err, res) => {
        if(err){

        }else{
          let response = res.body;
          if(response.length == 0){

          }else{
            this.setState({
              orphans : response
            });
          }
        }
      });
    }
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
    this.setState({open : false});
  };

  deleteSubject(){

  }

  deleteSubjectWithOrphans(){

  }

  render() {
    let orphans = 'No nodes are getting orphaned Go ahead and delete';
    let {paperStyle, switchStyle, submitStyle } = styles;
    if(this.state.orphans.length > 0){
      orphans = 'List of orphans If delted';
      orphans = this.state.orphans.map((orphan,i) =>
              <ListItem>{orphan.name}</ListItem>
            );
    }

    return (

        <div>
          <Dialog
            title="Delete Subject"
            modal={true}
            open={this.state.open}
          >
            {orphans}
            <RaisedButton
                label="Delete only Subject"
                primary={true}
                onTouchTap={this.deleteSubject}
                />
            <RaisedButton
                label="Delete with Orphans"
                secondary={true}
                onTouchTap={this.deleteSubjectWithOrphans}
                />
          </Dialog>
        </div>
    );
  }
}
