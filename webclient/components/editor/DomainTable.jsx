import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Request from 'superagent';
import FlatButton from 'material-ui/FlatButton';


export default class DomainTable extends React.Component {

  constructor(props) {
    super(props);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: true,
      tableData: null,
      tableFilteredData: null,
      searchTable: '',
      selectedDomain: this.props.domainName
    };
    this.getSubjects(this.props.domainName);
  }

  getSubjects(domainName){
    let url = `domain/${domainName}/subjects`;
    Request
    .get(url)
    .end((err, res) => {
      if(err) {
      // res.send(err);

      this.setState({errmsg: res.body, loading: 'hide'});
      }else {
        let response = res.body;
               if (response['subjects'].length == 0) {
                   this.setState({floatingLabelTextObject: "No Results"})
               } else {
                   var listSubjects = [];
                   //var domain = response['attributes']['name'];
                   for(let each in response['subjects']){
                     let nodekey = response['subjects'][each].label;
                     let nodename = response['subjects'][each].name;
                     let predicates = response['subjects'][each].predicates;
                     listSubjects.push({
                       //name: domain,
                       type: nodekey,
                       SubName: nodename,
                       predicate: predicates.toString()
                      });
                   }
                   this.setState({
                     tableData: listSubjects,
                     tableFilteredData: listSubjects,
                   })
               }
      }
    });
  }

  handleExport(){
    download(JSON.stringify(this.state.tableFilteredData), "domain.json", "text/json");
  }

  handleChange = (event) => {
    this.setState({height: event.target.value});
  };

  onRowSelection(index) {
    console.log(this.state.tableFilteredData[index[0]]);
  }

  handleTextFieldChange = (event) => {
    let rows = [];
    let search = event.target.value;
    this.state.tableData.map(function(row){
      if(Object.values(row).indexOf(search) > -1){
        rows.push(row);
      }
    });

    this.setState({
      searchTable: event.target.value,
      tableFilteredData: rows
    });
  };

  render() {
    let tableRowData = '';
    if(this.state.tableFilteredData !== null){
      //console.log(this.state.tableFilteredData);
      tableRowData = this.state.tableFilteredData.slice(0,10).map( (row, index) => (
        <TableRow key={index}>
          <TableRowColumn>{row.type}</TableRowColumn>
          <TableRowColumn>{row.SubName}</TableRowColumn>
          <TableRowColumn>{row.predicate}</TableRowColumn>
        </TableRow>
      ));
    }

    return (
      <div>
        <Table
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this.onRowSelection}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn colSpan="3" style={{textAlign: 'center'}}>
                <TextField
                  value={this.state.searchTable}
                  onChange={this.handleTextFieldChange}
                  floatingLabelText="Enter concept/intent"
                />
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="Node Type">Node Type</TableHeaderColumn>
              <TableHeaderColumn tooltip="Node Name">Node Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="Predicate">Predicates</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {tableRowData}
          </TableBody>
        </Table>
        <FlatButton label="Export" secondary={true} onTouchTap={this.handleExport.bind(this)}/>
      </div>
    );
  }
}
