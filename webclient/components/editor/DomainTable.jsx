import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

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

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
];

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
    getDomainDetails('Java Web Application Development');
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
        // console.log('Response on show: ', JSON.parse(res.text));
        // let domainList1=this.state.domainList;
        let response = JSON.parse(res.text);
        if(response.length === 0){
          this.setState({
            hintTextObject: "No Results",
          })
        }
        else {
          var listSubjects = [];
          for(let each in response){
            if(response.hasOwnProperty(each))
              listSubjects.push({nodeKey: each,nodeValue: response[each]});
          }
          listSubjects.push({nodeKey: 'D:'+ domainName,nodeValue: 'D:'+domainName});
          this.setState({
            subjectList: listSubjects,
            searchObjectText: '',
            loading: 'hide'
          });
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

  render() {
    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Super Header" style={{textAlign: 'center'}}>
                Super Header
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The ID">Domain Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Node Type</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Node Name</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.status}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
