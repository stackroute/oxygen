import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import Predicate from './Predicate.jsx';
//import Intent from './addIntent.jsx';
import NodeRelationEditor from './NodeRelationEditor.jsx';
import DomainTable from './DomainTable.jsx';
import Request from 'superagent';
import FlatButton from 'material-ui/FlatButton';
<<<<<<< HEAD
import HorizontalLinearStepper from './HorizontalLinearStepper.jsx';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
=======
import Graph from './TreeGraph.jsx';
>>>>>>> 286bfe2c89033709e4eeeb1664de0cabedabfdce

const styles = {
  div: {
    margin: 30
  },
  domainDiv: {
    width: '50%'
  }
};

const style = {
  margin : 30
}

const dataSourceConfig = {
  text: 'nodeKey',
  value: 'nodeValue',
};

export default class SubjectNode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchSubjectText: '',
      searchObjectText: '',
      searchRelText: '',
      nodeRelations: [],
      value: 1,
      hintTextDomain: "Enter a Domain",
      hintTextSubject: "No Domain Selected",
      hintTextObject: "No Subject Selected",
      hintTextRel: "No Object Selected",
      errmsg: null,
      loading: null,
      selectedDomain: null,
      domainList: [],
      subjectList: [],
      objectList: [],
      addLabel : 'Add Domain',
      relObjects: {},
      modalOpen: false,
      stepNumber: 0,
    };
    this.getDomains();
  }

  getSubjects(domainName){
    let url = `domain/${domainName}/domain/${domainName}/objects`;
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

  getObjects(nodeType,searchText){
    let url = '';
    switch(nodeType){
      case 'D':
        url = `domain/${searchText}/domain/${searchText}/objects`;
        break;
      case 'C':
        url = `domain/${searchText}/concept/${searchText}/objects`;
        break;
      case 'I':
        url = `domain/${searchText}/intent/${searchText}/objects`;
        break;
    }

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
          var listObjects = [];
          for(let each in response){
            if(response.hasOwnProperty(each))
              listObjects.push({nodeKey: each,nodeValue: response[each]});
          }
          this.setState({
            objectList: listObjects,
            searchRelText: '',
            loading: 'hide'
          });
        }
      }
    });
  }

  getDomains(){
    let url = `/domain/`;
    Request
    .get(url)
    .end((err, res) => {
      if(err) {
      this.setState({errmsg: res.body, loading: 'hide'});
      }else {
        let response = JSON.parse(res.text);
        if(response.length === 0){
          this.setState({subjectList: [], loading: 'hide'});
        }else{
          var listDomain = [];
          for(let each in response){
            listDomain.push(response[each]['name']);
          }
          this.setState({
            domainList: listDomain,
            loading: 'hide'
          });
        }
      }
    });
  }

  handleUpdateDomainInput = (searchText) => {
    this.getSubjects(searchText);
    this.setState({
      addLabel: 'Add Intent',
      hintTextSubject: 'Subjects loaded'
    });
  };

  handleUpdateSubjectInput = (searchText) => {
    console.log(searchText);
    this.getObjects(searchText.charAt(0),searchText.substr(2,searchText.length));
    this.setState({
      addLabel: 'Add Intent',
      hintTextObject: 'Objects loaded',
      stepNumber: 1
    });
  };

  handleUpdateObjectInput = (searchText) => {
    for (var key in this.state.objectList) {
      if(this.state.objectList[key]['nodeKey'] == searchText){
        this.setState({
          nodeRelations: this.state.objectList[key]['nodeValue'],
          hintTextRel: 'Relations Loaded',
          stepNumber:2
        });
        break;
      }
    }
  };
  

  handleChange = (event, index, value) => this.setState({value});

  handleNewRequest = () => {
    this.setState({
      searchSubjectText: '',
      searchObjectText: '',
      searchRelText: '',
    });
  };

  handleModalOpen = () => {
    this.setState({modalOpen: true});
  };

  handleModalClose = () => {
    this.setState({modalOpen: false});
  };

  render() {
    const actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleModalClose}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            onTouchTap={this.handleModalClose}
          />,
      ];
    let relObjects = [];
    let relTerm = [];
    let that = this;
    Object.keys(this.state.relObjects).map(function(key) {
          relObjects.push(<NodeRelationEditor relation={that.state.relObjects[key]} name={key}/>);
      });

    return (
      <div styles={styles.div}>
        <div style={{width : "50%",margin: 'auto'}}>
          <AutoComplete
            hintText={this.state.hintTextDomain}
            searchText={this.state.searchDomainText}
            onUpdateInput={this.handleUpdateDomainInput}
            onNewRequest={this.handleNewRequest}
            dataSource={this.state.domainList}
            filter={AutoComplete.caseInsensitiveFilter}
            openOnFocus={true}
            maxSearchResults={5}
            style={styles.div}
          />
        <HorizontalLinearStepper stepNumber = {this.state.stepNumber}/>
        </div>
        <Paper style={style}>
        <AutoComplete
          hintText={this.state.hintTextSubject}
          searchText={this.state.searchSubjectText}
          onUpdateInput={this.handleUpdateSubjectInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.subjectList}
          dataSourceConfig={dataSourceConfig}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
          style={styles.div}
        />
      <ContentAdd onClick={this.handleModalOpen} />
      -[
        <AutoComplete
          hintText={this.state.hintTextRel}
          searchText={this.state.searchRelText}
          onUpdateInput={this.handleUpdateRelInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.nodeRelations}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
          style={styles.div}
        />]-->
        <AutoComplete
          hintText={this.state.hintTextObject}
          searchText={this.state.searchObjectText}
          onUpdateInput={this.handleUpdateObjectInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.objectList}
          dataSourceConfig={dataSourceConfig}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
          style={styles.div}
        />
<<<<<<< HEAD
      </Paper>
=======
      <FlatButton label={this.state.addLabel} primary={true} onTouchTap={this.handleModalOpen}/>
      <Graph/>
>>>>>>> 286bfe2c89033709e4eeeb1664de0cabedabfdce
      <Dialog
          title="Add"
          actions={actions}
          modal={false}
          open={this.state.modalOpen}
        >
        {relObjects}
        </Dialog>
        <DomainTable/>
        <div class="treeGraph">
          <Graph/>
        </div>
      </div>
    );
  }
}
