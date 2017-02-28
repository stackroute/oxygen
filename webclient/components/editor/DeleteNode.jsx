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
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';

const styles = {
  block: {
   maxWidth: 250,
  },
  toggle: {
   marginBottom: 16,
  },
  thumbOff: {
   backgroundColor: '#ffcccc',
  },
  trackOff: {
   backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
   backgroundColor: 'red',
  },
  trackSwitched: {
   backgroundColor: '#ff9d9d',
  },
  labelStyle: {
   color: 'red',
  },
};

export default class DeleteNode extends React.Component {
  constructor(props) {
    super(props);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.getOrphans = this.getOrphans.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.deleteSubject = this.deleteSubject.bind(this);
    this.rowForm = this.rowForm.bind(this);
    this.state = {
      errMsg:'',
      open: false,
      canSubmit: false,
      openDialog: false,
      nodeDetails: null,
      orphans: [],
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      deleteNode: null,
      deleteNodeType: null,
      selectedDomain: null,
      deleteOrphans: 0,
      expanded: false,
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      open: nextProps.open,
    });
    this.getOrphans(nextProps.nodeDetails);
  }

  getOrphans(nodeDetails){
  if(nodeDetails.nodename !== undefined && nodeDetails.domainName !== undefined ){
      this.setState({
        selectedDomain: nodeDetails.domainName,
        deleteNode: nodeDetails.nodename,
        deleteNodeType: nodeDetails.nodetype
      })
      let url = `domain/${nodeDetails.domainName}/subject/${nodeDetails.nodetype}/${nodeDetails.nodename}`;
      Request.get(url).end((err, res) => {
        if(err){
        // console.log('inside if block');
      }else{
          let response = res.body;
          if(response.length == 0) {
            // console.log('inside if block');
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

  handleClose = () => {
    this.props.handleModal();
  };

  onRowSelection(index) {
    if(index == 'all'){
      this.setState({
        deleteOrphans: 1
      })
    }
  }

  rowForm(row){
    let color = 'black';
    if(row.count == 1){
      color = 'red';
    }
    return (
      <TableRow style = {{ color : color}}>
        <TableRowColumn>{row.label}</TableRowColumn>
        <TableRowColumn>{row.name}</TableRowColumn>
        <TableRowColumn>{row.count}</TableRowColumn>
      </TableRow>
    );
  }

  deleteSubject(){
    let url = `domain/${this.state.selectedDomain}/subject/${this.state.deleteNodeType}/${this.state.deleteNode}?cascade=${this.state.deleteOrphans}`;
    console.log(url);
    Request.delete(url).end((err, res) => {
      if(err){
          // console.log('inside if block');
      }else{
        let response = res.body;
        console.log(response['_stats']['nodesDeleted']);
        if(response.length == 0){
          // console.log('inside if block');
        }else{
          this.handleClose();
        }
      }
    });
  }

  handleToggle = (event, toggle) => {
    this.setState({
      expanded: toggle,
      deleteOrphans: 1
    });
  };

  render() {
    let {paperStyle, switchStyle, submitStyle } = styles;
    let orphans = [];
    if(this.state.orphans.length > 0){
      let that = this;
      this.state.orphans.map( (row, index) => (
          orphans.push(that.rowForm(row))
        ));
    }

    return (
        <div>
          <Dialog
            title="List of Nodes Connected"
            modal={true}
            open={this.state.open}
            autoScrollBodyContent={true}
          >
          <Table
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
            onRowSelection={this.onRowSelection}
            style = {styles.switchStyle}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderColumn tooltip="Node Type">Node Type</TableHeaderColumn>
                <TableHeaderColumn tooltip="Node Name">Node Name</TableHeaderColumn>
                <TableHeaderColumn tooltip="Count">Count</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={this.state.showCheckboxes}
              deselectOnClickaway={this.state.deselectOnClickaway}
              showRowHover={this.state.showRowHover}
              stripedRows={this.state.stripedRows}
            >
            {orphans}
            </TableBody>
          </Table>
          <Toggle
            style = {{margin: '5px'}}
            toggled={this.state.expanded}
            onToggle={this.handleToggle}
            labelPosition="right"
            label="Toggle to delete its connected nodes too."
            thumbStyle={styles.thumbOff}
            trackStyle={styles.trackOff}
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
            labelStyle={styles.labelStyle}
          />
            <RaisedButton
                label="Delete"
                primary={true}
                onTouchTap={this.deleteSubject}
                />
            <RaisedButton
                label="Close"
                default={true}
                onTouchTap={this.handleClose}
                styles = {styles.closeButton}
                />
          </Dialog>
        </div>
    );
  }
}
