import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Request from 'superagent';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

export default class TableExampleComplex extends React.Component {

  constructor(props) {
    super(props);

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
      height: '300px',
      tableData: null,
    };
    this.getSubjects('Java Web Application Development');
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
                   var domain = response['attributes']['name'];
                   for(let each in response['subjects']){
                     let nodekey = response['subjects'][each].label;
                     let nodename = response['subjects'][each].name;
                     let predicates = response['subjects'][each].predicates;
                     listSubjects.push({
                       name: domain,
                       type: nodekey,
                       SubName: nodename,
                       predicate: predicates.toString()
                      });
                   }
                   this.setState({
                     tableData: listSubjects
                   })
               }
      }
    });
  }

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled,
    });
  };

  handleChange = (event) => {
    this.setState({height: event.target.value});
  };

  onRowSelection(key) {
    console.log(key);
  }

  render() {
    let tableRowData = '';
    if(this.state.tableData !== null){
      tableRowData = this.state.tableData.map( (row, index) => (
      <TableRow key={index} value={row} selected={row.selected}>
        <TableRowColumn>{row.name}</TableRowColumn>
        <TableRowColumn>{row.type}</TableRowColumn>
        <TableRowColumn>{row.SubName}</TableRowColumn>
        <TableRowColumn>{row.predicate}</TableRowColumn>
      </TableRow>
    ));
    }

    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          selectable={this.state.selectable}
          onRowSelection={this.onRowSelection}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Super Header" style={{textAlign: 'center'}}>
                Super Header
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The ID">Domain Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="Node Type">Node Type</TableHeaderColumn>
              <TableHeaderColumn tooltip="Node Name">Node Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="Predicate">Predicate?s</TableHeaderColumn>
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
      </div>
    );
  }
}
