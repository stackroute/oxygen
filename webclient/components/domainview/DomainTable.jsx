import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Request from 'superagent';
import FlatButton from 'material-ui/FlatButton';
import Pagination from 'rc-pagination';
export default class DomainTable extends React.Component {
  constructor(props) {
    super(props);
    //this.onRowSelection = this.onRowSelection.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {

      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: false,
      showCheckboxes: false,
      tableData: {},
      tableFilteredData: null,
      searchTable: '',
      selectedDomain: this.props.domainName,
      pageNumber: 0,
      totalPages: 0
    };
    this.getSubjects(this.props.domainName);
  }
  getSubjects(domainName){
    let url = `/domain/${domainName}/subjects`;
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

             //console.log('Kowsik',listSubjects.length);
             this.setState({
               tableData: listSubjects,
               totalPages: listSubjects.length / 10,
               pageNumber: 1,
               tableFilteredData: listSubjects.slice(0,10),
             })
         }
      }
    });
  }
  handleExport(){
    download(JSON.stringify(this.state.tableData), "domain.json", "text/json");
  }

  handleChange = (event) => {
    this.setState({height: event.target.value});
  };
  // onRowSelection(index) {
  //   console.log(this.state.tableFilteredData[index[0]]);
  // }
  onChange(page){
    let data = this.state.tableData.slice(page,page+10)
    this.setState({
      pageNumber: page,
      tableFilteredData: data
    });
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
      tableRowData = this.state.tableFilteredData.map( (row, index) => (
        <TableRow key={index}>
          <TableRowColumn>{row.type}</TableRowColumn>
          <TableRowColumn>{row.SubName}</TableRowColumn>
          <TableRowColumn>{row.predicate}</TableRowColumn>
        </TableRow>
      ));
    }
    return (
      <div>
        <center><h1 style={{marginTop:'5%',color: 'rgb(0,128, 128)',fontFamily: 'sans-serif'}}>List View Of {this.state.selectedDomain}</h1></center>
        <Table
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
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
        <center>
        <Pagination style={{marginLeft:'43%'}} className="ant-pagination" onChange={this.onChange} defaultCurrent={this.state.pageNumber} total={this.state.tableData.length} />
        <FlatButton label="Export" secondary={true} onTouchTap={this.handleExport.bind(this)}/>
        </center>
      </div>
    );
  }
}
