import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import Predicate from './Predicate.jsx';
<<<<<<< HEAD
=======
//import Intent from './addIntent.jsx';
>>>>>>> c5ae5b7cd8629eb5838757318cbefa95e769eb84
import NodeRelationEditor from './NodeRelationEditor.jsx';
import Request from 'superagent';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  div: {
    margin: 30
  },
};

const rel = ['No relations','No relations'];
export default class SubjectNode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchSubjectText: '',
      searchObjectText: '',
<<<<<<< HEAD
      nodeRelations: rel,
      value: 1,
      hintTextSubject: "Enter a Domain",
      hintTextObject: "Nothing selected",
=======
      searchRelText: '',
      nodeRelations: rel,
      value: 1,
      hintTextSubject: "Enter a Subject",
      hintTextObject: "No Subject Selected",
      hintTextRel: "No Object Selected",
>>>>>>> c5ae5b7cd8629eb5838757318cbefa95e769eb84
      errmsg: null,
      loading: null,
      subjectList: [],
      objectList: [],
      addLabel : 'Add Domain',
      relObjects: {},
      modalOpen: false,
    };
    this.getDomains();
  }

<<<<<<< HEAD
=======
  getTerms(searchIntent, searchTerm){
    let url = `domain/${searchIntent}/intents/${searchTerm}/term`;
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
        if(response['Terms'].length === 0){
          this.setState({
            hintTextTerm: "No Results",
          })
        }
        else {
          this.setState({
            relTerm: response['Terms'],
            TermList: Object.keys(response['Terms'])
          });
        }
      }
    });
  }

getTerms(searchText){
  let url = `domain/${searchText}/intents/${sear}`
}
>>>>>>> c5ae5b7cd8629eb5838757318cbefa95e769eb84
  getIntents(searchText){
    let url = `domain/${searchText}/intents`;
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
        if(response['Intents'].length === 0){
          this.setState({
            hintTextObject: "No Results",
          })
        }
        else {
          this.setState({
            relObjects: response['Intents'],
            objectList: Object.keys(response['Intents'])
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
            subjectList: listDomain,
            loading: 'hide'
          });
        }
      }
    });
  }

  handleUpdateSubjectInput = (searchText) => {
    this.getIntents(searchText);
    this.setState({
      addLabel: 'Add Intent',
    });
  };

  handleUpdateObjectInput = (searchText) => {
    let relations = this.state.relObjects[searchText];
    this.setState({
      nodeRelations: relations,
      addLabel: 'Edit Intent',
    });
  };
<<<<<<< HEAD
=======
  handleUpdateTermInput = (searchIntent, searchTerm) => {
    let relations = this.state.relTerm[searchIntent, searchTerm];
    this.setState({
      nodeRelations: relations,
      addLabel: 'Edit Term',
    });
  };
>>>>>>> c5ae5b7cd8629eb5838757318cbefa95e769eb84

  handleChange = (event, index, value) => this.setState({value});

  handleNewRequest = () => {
    this.setState({
      searchSubjectText: '',
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
    var menuitems =
      this.state.nodeRelations.map((relation,i) => <MenuItem value={i+1} primaryText={relation}/>);
    let relObjects = [];
<<<<<<< HEAD
=======
    let relTerm = [];
>>>>>>> c5ae5b7cd8629eb5838757318cbefa95e769eb84
    let that = this;
    Object.keys(this.state.relObjects).map(function(key) {
          relObjects.push(<NodeRelationEditor relation={that.state.relObjects[key]} name={key}/>);
      });
<<<<<<< HEAD
=======
    Object.keys(this.state.relObjects).map(function(key) {
            relObjects.push(<NodeRelationEditor relation={that.state.relObjects[key]} name={key}/>);
        });
>>>>>>> c5ae5b7cd8629eb5838757318cbefa95e769eb84

    return (
      <div styles={styles.div}>
        <AutoComplete
          hintText={this.state.hintTextSubject}
          searchText={this.state.searchSubjectText}
          onUpdateInput={this.handleUpdateSubjectInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.subjectList}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
        />-[
        <AutoComplete
          hintText={this.state.hintTextRel}
          searchText={this.state.searchRelText}
          onUpdateInput={this.handleUpdateRelInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.nodeRelations}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
<<<<<<< HEAD
=======
        />]->
        <AutoComplete
          hintText={this.state.hintTextObject}
          searchText={this.state.searchObjectText}
          onUpdateInput={this.handleUpdateObjectInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.objectList}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
>>>>>>> c5ae5b7cd8629eb5838757318cbefa95e769eb84
        />
      <FlatButton label={this.state.addLabel} primary={true} onTouchTap={this.handleModalOpen}/>
      <Dialog
          title="Edit"
          actions={actions}
          modal={true}
          open={this.state.modalOpen}
        >
        {relObjects}
        </Dialog>
      </div>
    );
  }
}
