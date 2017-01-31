import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import Predicate from './Predicate.jsx';
//import Intent from './addIntent.jsx';
import NodeRelationEditor from './NodeRelationEditor.jsx';
import Request from 'superagent';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  customWidth: {
    width: 200
  },
};

const rel = ['No relations'];
export default class SubjectNode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchSubjectText: '',
      searchObjectText: '',
      searchTermText: '',
      nodeRelations: rel,
      value: 1,
      hintTextSubject: "Enter a Domain",
      hintTextObject: "Nothing selected",
      hintTextTerm: "Nothing selected",
      errmsg: null,
      loading: null,
      subjectList: [],
      objectList: [],
      addLabel : 'Add Domain',
      relObjects: {},
      termList: [],
      addLabel : 'Add Domain',
      relObjects: {},
      relTerm: {},
      addLabel : 'Add Domain',
      relObjects: {},
      modalOpen: false,
    };
    this.getDomains();
  }

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
  handleUpdateTermInput = (searchIntent, searchTerm) => {
    let relations = this.state.relTerm[searchIntent, searchTerm];
    this.setState({
      nodeRelations: relations,
      addLabel: 'Edit Term',
    });
  };

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
    let relTerm = [];
    let that = this;
    Object.keys(this.state.relObjects).map(function(key) {
          relObjects.push(<NodeRelationEditor relation={that.state.relObjects[key]} name={key}/>);
      });
    Object.keys(this.state.relObjects).map(function(key) {
            relObjects.push(<NodeRelationEditor relation={that.state.relObjects[key]} name={key}/>);
        });

    return (
      <div>
        <AutoComplete
          hintText={this.state.hintTextSubject}
          searchText={this.state.searchSubjectText}
          onUpdateInput={this.handleUpdateSubjectInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.subjectList}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
        />
        <DropDownMenu
            value={this.state.value}
            onChange={this.handleChange}
            style={styles.customWidth}
            autoWidth={false}
          >
          {menuitems}
        </DropDownMenu>
        <AutoComplete
          hintText={this.state.hintTextObject}
          searchText={this.state.searchObjectText}
          onUpdateInput={this.handleUpdateObjectInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.objectList}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
        />
        <AutoComplete
          hintText={this.state.hintTextTerm}
          searchText={this.state.searchTermText}
          onUpdateInput={this.handleUpdateTermInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.termList}
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus={true}
          maxSearchResults={5}
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
