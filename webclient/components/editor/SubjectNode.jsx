import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import NodeRelationEditor from './NodeRelationEditor.jsx';
import Request from 'superagent';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import {cyan500} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import Add from './Add.jsx';
import AddPredicate from './AddPredicate.jsx';
import DeletePredicate from './deletePredicate.jsx';
import AddObjects from './AddObjects.jsx';
import Delete from './delete.jsx';
import Edit from './edit.jsx';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import HorizontalLinearStepper from './HorizontalLinearStepper.jsx';
import TreeGraph from './TreeGraph.jsx';
import {Tabs, Tab} from 'material-ui/Tabs';
import DeleteNode from './DeleteNode.jsx';
import DomainTable from './DomainTable.jsx';

const style = {
  margin: 30,
  fontFamily: 'sans-serif',
  textAlign: 'center'
}

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
    },

    div: {
        marginLeft: 10
    },

    underlineStyle: {
        borderColor: cyan500
    }
};

const dataSourceConfig = {
    text: 'nodeKey',
    value: 'nodeValue'
};


export default class SubjectNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false,
            nodeRelations: [],
            value: 1,
            floatingLabelTextSubject: "Subjects",
            floatingLabelTextObject: "Objects",
            floatingLabelTextRel: "Predicate",
            errmsg: null,
            loading: null,
            selectedDomain: this.props.params.domainName,
            selectedSubject: '',
            selectedObject: '',
            selectedPredicate: '',
            domainList: [],
            subjectList: [],
            objectList: [],
            predicateList:[],
            addLabel: 'Add Domain',
            relObjects: {},
            editmodalopen: false,
            deleteModalOpen: false,
            stepNumber:0,
            objectPredicates: [],
            nodeDetails: null,
        };
        this.getSubjects(this.state.selectedDomain);
    }

    getSubjects(domainName) {
        let url = `domain/${domainName}/subjects`;
        Request.get(url).end((err, res) => {
            if (err) {
                // res.send(err);
                this.setState({errmsg: res.body, loading: 'hide'});
            } else {
                // console.log('Response on show: ', JSON.parse(res.text));
                // let domainList1=this.state.domainList;
                let response = res.body;
                if (response['subjects'].length == 0) {
                    this.setState({floatingLabelTextObject: "No Results"})
                } else {
                    var listSubjects = [];

                    for(let each in response['subjects']){
                      let nodekey = response['subjects'][each].label ;
                      listSubjects.push({
                         nodeKey: nodekey.charAt(0) +': '+ response['subjects'][each]['name'],
                         nodeValue: nodekey.charAt(0) +': '+ response['subjects'][each]['name']
                       });
                    }
                    this.setState({subjectList: listSubjects, searchObjectText: '', loading: 'hide'});
                }
            }
        });
    }

    getObjects(nodeType, searchText) {
        let url = '';
        switch (nodeType) {
            case 'C':
                url = `/domain/${this.state.selectedDomain}/subject/concept/${searchText}/objects`;
                break;
            case 'I':
                url = `/domain/${this.state.selectedDomain}/subject/intent/${searchText}/objects`;
                break;
        }

        Request.get(url).end((err, res) => {
            if (err) {
                // res.send(err);
                this.setState({errmsg: res.body, loading: 'hide'});
            } else {
                // console.log('Response on show: ', JSON.parse(res.text));
                // let domainList1=this.state.domainList;
                let response = JSON.parse(res.text);
                console.log(response);
                if (response['objects'].length == 0) {
                    this.setState({floatingLabelTextObject: "No Results"});
                }
                else {
                    var listObjects = [];
                    var listPredicates = [];
                    for(let each in response['objects']){
                      let label;
                      if(nodeType == "C"){
                        label = "C";
                      }
                      else {
                        label = "T";
                      }
              let nodekey = response['objects'][each]['name'] ;

                       listObjects.push(label +': '+ response['objects'][each]['name']);

                       console.log(nodekey);
                       listPredicates[response['objects'][each]['name']] = response['objects'][each]['predicates'];
                    }
                    this.setState(
                      {
                        predicateList:listPredicates,
                        objectList: listObjects,
                        searchRelText: '',
                        loading: 'hide'
                      });
                }
            }
        });
    }

    enableButton() {
      this.setState({
        canSubmit: true,
      });
    };

    getDomains() {
        let url = `/domain/`;
        Request.get(url).end((err, res) => {
            if (err) {
                this.setState({errmsg: res.body, loading: 'hide'});
            } else {
                let response = JSON.parse(res.text);
                if (response.length === 0) {
                    this.setState({subjectList: [], loading: 'hide'});
                } else {
                    var listDomain = [];
                    for (let each in response) {
                        listDomain.push(response[each]['name']);
                    }
                    this.setState({domainList: listDomain, loading: 'hide'});
                }
            }
        });
    }

    handleUpdateDomainInput = (searchText) => {
        this.getSubjects(searchText);
        this.setState({addLabel: 'Add Intent',
          floatingLabelTextSubject: 'Subjects loaded'});
    };

    handleUpdateSubjectInput = (searchText) => {
        console.log(searchText);
        this.getObjects(searchText.charAt(0),
        searchText.substr(3, searchText.length));
        this.setState({
           addLabel: 'Add Intent',
           floatingLabelTextObject: 'Objects',
           selectedSubject: searchText,
           stepNumber:1
         });
    };

    handleUpdateObjectInput = (searchText) => {
       let predicates = this.state.predicateList[searchText.substr(3, searchText.length)];
       console.log(predicates);
        this.setState({
          nodeRelations: predicates,
          searchObjectText: searchText,
          selectedObject: searchText,
          stepNumber:2
        });
    };

    handleDeleteSubject = () => {
      if(this.state.selectedSubject.length == 0){

      }else{
        let nodetype = '';
        let nodename = this.state.selectedSubject.substr(3, this.state.selectedSubject.length);
        //console.log(nodename);
        if(this.state.selectedSubject.charAt(0) == 'I'){
          nodetype = 'Intent';
        }else{
          nodetype = 'Concept';
        }
        let nodeDetails = {
          domainName : this.state.selectedDomain,
          nodetype: nodetype,
          nodename: nodename
        };

        this.setState({
          nodeDetails: nodeDetails,
          deleteModalOpen : true
        });
      }
    };

    handleDeleteObject = () => {
      if(this.state.selectedObject.length == 0){

      }else{

      }
    };


    handleChange = (event, index, value) => this.setState({value});

    handleNewRequest = () => {
        this.setState({searchSubjectText: '', searchObjectText: '', searchRelText: ''});
    };

    render() {
      let {paperStyle, switchStyle, submitStyle } = styles;
      const {stepIndex} = this.state;
        return (
            <div styles={styles.div}>
                <div style={{
                    textAlign: "center"
                }}>
                <h1 styles= {style}>{this.state.selectedDomain}</h1>
                </div>
                <HorizontalLinearStepper stepNumber={this.state.stepNumber}/>
                <Paper style={style}>
                    <div>
                        <AutoComplete
                          floatingLabelText={this.state.floatingLabelTextSubject}
                          searchText={this.state.searchSubjectText}
                          onUpdateInput={this.handleUpdateSubjectInput}
                          onNewRequest={this.handleNewRequest}
                          dataSource={this.state.subjectList}
                          dataSourceConfig={dataSourceConfig}
                          filter={AutoComplete.caseInsensitiveFilter}
                          openOnFocus={true}
                          maxSearchResults={5}
                          style={styles.div}/>
                        <ContentAdd onTouchTap={this.handleModalAddOpen} style={{cursor:'pointer', color:'#09F415'}}/>
                        <ActionDelete onTouchTap={this.handleDeleteSubject} style={{cursor:'pointer', color:'red'}}/>
                        <ImageEdit onTouchTap={this.handleModalEditOpen} style={{cursor:'pointer', color:'blue'}}/>
                    </div>

                    <div>
                        <AutoComplete floatingLabelText={this.state.floatingLabelTextObject}
                          searchText={this.state.searchObjectText}
                          onUpdateInput={this.handleUpdateObjectInput}
                          onNewRequest={this.handleNewRequest}
                          dataSource={this.state.objectList}
                          filter={AutoComplete.caseInsensitiveFilter}
                          openOnFocus={true}
                          maxSearchResults={5}
                          style={styles.div}/>
                        <ContentAdd onTouchTap={this.handleModalObjAddOpen} style={{cursor:'pointer',color:'#09F415'}}/>
                        <ActionDelete onTouchTap={this.handleDeleteObject} style={{cursor:'pointer',color:'red'}}/>
                        <ImageEdit onTouchTap={this.handleModalEditOpen} style={{cursor:'pointer', color:'blue'}}/>
                    </div>

                    <div>
                        <AutoComplete
                          floatingLabelText={this.state.floatingLabelTextRel}
                          searchText={this.state.searchRelText}
                          onUpdateInput={this.handleUpdateRelInput}
                          onNewRequest={this.handleNewRequest}
                          dataSource={this.state.nodeRelations}
                          filter={AutoComplete.caseInsensitiveFilter}
                          openOnFocus={true}
                          maxSearchResults={5}
                          style={styles.div}
                          />
                        <ContentAdd onTouchTap={this.handleModalPredAddOpen} style={{cursor:'pointer', color:'#09F415'}}/>
                        <ActionDelete onTouchTap={this.handleModalDeleteOpen} style={{cursor:'pointer', color:'red'}}/>
                        <ImageEdit onTouchTap={this.handleModalEditOpen} style={{cursor:'pointer', color:'blue'}}/>
                    </div>

                </Paper>
                <DeleteNode open = {this.state.deleteModalOpen} nodeDetails = {this.state.nodeDetails}/>
                <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
                    <Tab label="Graph View" value="l">
                      <div>
                          <div className="treeGraph">
                              <TreeGraph domainName={this.state.selectedDomain}/>
                          </div>
                      </div>
                    </Tab>
                    <Tab label="List View" value="g">
                      <div>
                          <DomainTable domainName={this.state.selectedDomain}/>
                      </div>
                    </Tab>
                </Tabs>
            </div>
        );//End of Return
    }//End of Render
}//End of Class
