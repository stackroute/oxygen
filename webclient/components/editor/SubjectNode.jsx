import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import NodeRelationEditor from './NodeRelationEditor.jsx';
import Request from 'superagent';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import {cyan500} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import AddSubject from './AddSubject.jsx';
import AddPredicate from './AddPredicate.jsx';
import DeletePredicate from './DeletePredicate.jsx';
import AddObject from './AddObject.jsx';
import Delete from './DeleteNode.jsx';
import Edit from './edit.jsx';
import {
    FormsyCheckbox,
    FormsyDate,
    FormsyRadio,
    FormsyRadioGroup,
    FormsySelect,
    FormsyText,
    FormsyTime,
    FormsyToggle,
    FormsyAutoComplete
} from 'formsy-material-ui/lib';
import SubjectCard from './SubjectCard.jsx';
import HorizontalLinearStepper from './HorizontalLinearStepper.jsx';
import TreeGraph from './TreeGraph.jsx';
import {Tabs, Tab} from 'material-ui/Tabs';
import DeleteNode from './DeleteNode.jsx';
import DomainTable from './DomainTable.jsx';
import {Container, Col, Row, Visible} from 'react-grid-system';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import IconButton from 'material-ui/IconButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ObjectCard from './ObjectCard.jsx';
import PredicateCard from './PredicateCard.jsx';
import {ScreenClassRender} from 'react-grid-system';

const style = {
    margin: 30,
    textAlign: "center",
    fontFamily: "sans-serif",
    overflowX: "hidden"
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
    },

    largeIcon: {
        width: 60,
        height: 30,
        margin: 30
    },

    customWidth: {
        width: 400
    },

    textWidth: {
        width: 375
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
            floatingLabelTextSubject: "Subject",
            floatingLabelTextObject: "Object",
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
            predicateList: [],
            addLabel: 'Add Domain',
            relObjects: {},
            editmodalopen: false,
            deleteModalOpen: false,
            stepNumber: 0,
            objectPredicates: [],
            nodeDetails: null,
            openAddSubject: false,
            openAddObject: false,
            openAddPredicate: false,
            selectedSubjectDetails: {},
            selectedObjectDetails: {},
            selectedPredicateDetails: {},
            subjectCardJsx: false,
            objectCardJsx: false,
            predicateCardJsx: false
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

                    for (let each in response['subjects']) {
                        let nodekey = response['subjects'][each].label;
                        listSubjects.push({
                            nodeKey: nodekey.charAt(0) + ': ' + response['subjects'][each]['name'],
                            nodeValue: nodekey.charAt(0) + ': ' + response['subjects'][each]['name']
                        });
                    }

                    this.setState({
                      selectedSubjectDetails: response.attributes,
                      subjectList: listSubjects,
                      searchObjectText: '', loading: 'hide'});
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
                if (response['objects'].length == 0) {
                    this.setState({floatingLabelTextObject: "No Results"});
                } else {
                    var listObjects = [];
                    var listPredicates = [];
                    let nodeDetails = {};
                    for (let each in response['objects']) {
                        let label;
                        if (nodeType == "C") {
                            label = "C";
                        } else {
                            label = "T";
                        }
                        let nodekey = response['objects'][each]['name'];

                        listObjects.push(label + ': ' + response['objects'][each]['name']);

                        console.log(nodekey);
                        listPredicates[response['objects'][each]['name']] = response['objects'][each]['predicates'];
                    }
                    this.setState({
                      predicateList: listPredicates,
                      objectList: listObjects,
                      searchRelText: '',
                      loading: 'hide',
                    });
                }
            }
        });
    }

    enableButton() {
        this.setState({canSubmit: true});
    };

    handleModalAddOpen = () => {
        this.setState({openAddSubject: true});
        this.setState({openAddObject: true});
        this.setState({openAddPredicate: true});
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
        this.setState({
            addLabel: 'Add Intent', floatingLabelTextSubject: 'Subjects loaded',

            //stepNumber:0
        });

    };

    //Use this to send for object creation line 220
    handleUpdateSubjectInput = (searchText) => {
        console.log(searchText);
        let selectedSubjectDetails = {};
        this.getObjects(searchText.charAt(0), searchText.substr(3, searchText.length));
        if (searchText.length == 0) {
            this.setState({stepNumber: 0});
            console.log("Herer" + this.state.stepNumber);
        } else {
            this.setState({
              addLabel: 'Add Intent',
              floatingLabelTextObject: 'Objects',
              selectedSubject: searchText,
              stepNumber: 1});
              //console.log('kowsik '+this.state.selectedSubject);
              let nodeName = searchText.substr(3, searchText.length);
              let url = '';
              let nodeType = '';
              switch (searchText.charAt(0)) {
                  case 'C':
                      nodeType = 'Concept'
                      url = `/domain/${this.state.selectedDomain}/subject/concept/${nodeName}/objects`;
                      break;
                  case 'I':
                      nodeType = 'Intent'
                      url = `/domain/${this.state.selectedDomain}/subject/intent/${nodeName}/objects`;
                      break;
              }

              Request.get(url).end((err, res) => {
                  if (err) {
                      this.setState({
                        errmsg: res.body,
                        loading: 'hide'});
                  } else {
                      let response = JSON.parse(res.text);
                      if (response.length == 0) {
                          this.setState({floatingLabelTextObject: "No Results"});
                      } else {
                        selectedSubjectDetails['name'] = nodeName;
                        selectedSubjectDetails['type'] = nodeType;
                        selectedSubjectDetails['attributes'] = response.attributes;

                        this.setState({
                          selectedSubjectDetails: selectedSubjectDetails,
                          subjectCardJsx: true
                          });
                      }
                  }
              });
        }
    };

    handleUpdateObjectInput = (searchText) => {
        let selectedObjectDetails = {};
        let predicates = this.state.predicateList[searchText.substr(3, searchText.length)];
        console.log('Kowsik = ' + searchText);

        console.log(this.state.selectedSubject);
        if (searchText.length == 0) {
            this.setState({stepNumber: 1});
            console.log("Herer" + this.state.stepNumber);
        } else {
            this.setState({nodeRelations: predicates, selectedObject: searchText, stepNumber: 2});
            console.log('asdasd' + this.state.stepNumber);

            let nodeName1 = this.state.selectedSubject.substr(3, this.state.selectedSubject.length - 1);
            let nodeName2 = searchText.substr(3, searchText.length - 1);
            let nodeType = '';
            console.log(nodeName1);
            console.log(nodeName2);

            let url = '';
            switch (this.state.selectedSubjectDetails['type'].charAt(0)) {
                case 'C':
                    nodeType = 'Concept';
                    url = `/domain/${this.state.selectedDomain}/subject/Concept/${nodeName1}/object/Concept/${nodeName2}`;
                    break;
                case 'I':
                    nodeType = 'Term';
                    url = `/domain/${this.state.selectedDomain}/subject/Intent/${nodeName1}/object/Term/${nodeName2}`;
                    break;
            }
            Request.get(url).end((err, res) => {
                if (err) {
                    this.setState({errmsg: res.body, loading: 'hide'});
                } else {
                    let response = JSON.parse(res.text);
                    if(response.length == 0){
                      this.setState({floatingLabelTextObject: "No Results"});
                    }else{
                      selectedObjectDetails['name'] = nodeName2;
                      selectedObjectDetails['type'] = nodeType;
                      selectedObjectDetails['attributes'] = response;
                      console.log('inside '+selectedObjectDetails['attributes']['name']);
                      this.setState({
                        selectedObjectDetails: selectedObjectDetails,
                        objectCardJsx: true
                        });
                    }
                }
            });
        }
    };

    handleUpdateRelInput = (searchText) => {
        let selectedPredicateDetails = {};

        let nodeName1 = this.state.selectedSubjectDetails['name'];
        let nodeName2 = this.state.selectedObjectDetails['name'];
        console.log(searchText);
        console.log(nodeName1);
        console.log(nodeName2);
        let url = '';
        switch (this.state.selectedSubjectDetails['type'].charAt(0)) {
            case 'C':
                url = `/domain/${this.state.selectedDomain}/subject/Concept/${nodeName1}/object/Concept/${nodeName2}/predicates/${searchText}`;
                break;
            case 'I':
                url = `/domain/${this.state.selectedDomain}/subject/Intent/${nodeName1}/object/Term/${nodeName2}/predicates/${searchText}`;
                break;
        }
        Request.get(url).end((err, res) => {
            if (err) {
                this.setState({errmsg: res.body, loading: 'hide'});
            } else {
                let response = JSON.parse(res.text);
                selectedPredicateDetails['name'] = searchText;
                selectedPredicateDetails['properties'] = response;

                this.setState({
                  selectedPredicateDetails: selectedPredicateDetails
                  });
            }
        });
    }

    handleDeleteSubject = () => {
        if (this.state.selectedSubject.length == 0) {} else {
            let nodetype = '';
            let nodename = this.state.selectedSubject.substr(3, this.state.selectedSubject.length);
            //console.log(nodename);
            if (this.state.selectedSubject.charAt(0) == 'I') {
                nodetype = 'Intent';
            } else {
                nodetype = 'Concept';
            }
            let nodeDetails = {
                domainName: this.state.selectedDomain,
                nodetype: nodetype,
                nodename: nodename
            };

            this.setState({nodeDetails: nodeDetails, deleteModalOpen: true});
        }
    };

    handleEditNode = () => {
        if (this.state.selectedSubject.length === 0) {} else {
            let nodeType = '',
                nodeName = this.state.selectedSubject.substr(3, this.state.selectedSubject.length);
            if (this.state.selectedSubject.charAt(0) == 'I') {
                nodeType = "Intent";
            } else if (this.state.selectedSubject.charAt(0) == 'C') {
                nodeType = "concept";
            }
            let nodeDetails = {
                domainName: this.state.selectedDomain,
                nodeType: nodeType,
                nodeName: nodeName
            };
            this.setState({nodeDetails: nodeDetails, editModalOpen: true});
        }
    }

    handleDeleteObject = () => {
        if (this.state.selectedObject.length == 0) {} else {}
    };

    handleChange = (event, index, value) => this.setState({value});

    handleNewRequest = () => {
        this.setState({searchSubjectText: '', searchObjectText: '', searchRelText: ''});
    };

    render() {

        let {paperStyle, switchStyle, submitStyle} = styles;
        const {stepIndex} = this.state;
        return (
            <div styles={styles.div}>
                <div style={{
                    textAlign: "center",
                    fontFamily: "sans-serif",
                    color: " rgb(25, 118, 210)"
                }}>
                    <h1 styles={style}>{this.state.selectedDomain}</h1>
                </div>

                <Paper style={style}>
                    <HorizontalLinearStepper stepNumber={this.state.stepNumber}/>
                    <Row style={{

                        marginRight: '75%'
                    }}>C - Concept, I - Intent, T - Term</Row>

                    <Row>
                        <Col lg={4} xl={4} md={4} sm={12} xs={12}>
                            <Row>
                                <AutoComplete floatingLabelText={this.state.floatingLabelTextSubject} searchText={this.state.searchSubjectText} onUpdateInput={this.handleUpdateSubjectInput} onNewRequest={this.handleNewRequest} dataSource={this.state.subjectList} dataSourceConfig={dataSourceConfig} filter={AutoComplete.caseInsensitiveFilter} openOnFocus={true} maxSearchResults={5}/>
                            </Row>
                            <Row style={{
                                marginLeft: 170
                            }}>
                                <FlatButton label="Add New" labelStyle={{
                                    fontSize: 10
                                }}/>
                            </Row>
                        </Col>

                        <Col lg={4} xl={4} md={4} sm={12} xs={12}>
                            <Row>
                                <AutoComplete floatingLabelText={this.state.floatingLabelTextRel} searchText={this.state.searchRelText} onUpdateInput={this.handleUpdateRelInput} onNewRequest={this.handleNewRequest} dataSource={this.state.nodeRelations} filter={AutoComplete.caseInsensitiveFilter} openOnFocus={true} maxSearchResults={5}/>

                            </Row>
                        </Col>

                        <Col lg={4} xl={4} md={4} sm={12} xs={12}>
                            <Row>
                                <AutoComplete floatingLabelText={this.state.floatingLabelTextObject} searchText={this.state.searchObjectText} onUpdateInput={this.handleUpdateObjectInput} onNewRequest={this.handleNewRequest} dataSource={this.state.objectList} filter={AutoComplete.caseInsensitiveFilter} openOnFocus={true} maxSearchResults={5}/>
                            </Row>
                            <Row style={{
                                marginLeft: 170
                            }}>
                                <FlatButton label="Add New" labelStyle={{
                                    fontSize: 10
                                }}/>
                            </Row>
                        </Col>

                    </Row>
                    <br/>
                    <Divider/>
                    <br/>
                    <Row style={{
                        marginLeft: '80%'
                    }}>

                        <RaisedButton label="Apply" style={{
                            float: 'left',
                            marginRight: 10,
                            marginBottom: 10
                        }}/>
                        <RaisedButton label="Dissolve" style={{
                            float: 'left'
                        }}/>
                    </Row>
                    <br/>
                    <Row>
                          <SubjectCard subjectCard={this.state.selectedSubjectDetails} subjectCardJsx={this.state.subjectCardJsx}/>
                          <PredicateCard predicateCard={this.state.selectedPredicateDetails} predicateCardJsx={this.state.predicateCardJsx}/>
                          <ObjectCard objectCard={this.state.selectedObjectDetails} objectCardJsx={this.state.objectCardJsx}/>
                    </Row>
                    <br/>

                </Paper>

                <AddSubject open={this.state.openAddSubject} domain={this.state.selectedDomain}/>
                <AddObject open={this.state.openAddObject} domain={this.state.selectedDomain} subject={this.state.selectedSubject}/>
                <AddPredicate open={this.state.openAddPredicate} domain={this.state.selectedDomain} subject={this.state.selectedSubject} object={this.state.selectedObject}/>
                <DeleteNode open={this.state.deleteModalOpen} nodeDetails={this.state.nodeDetails}/>
                <Edit open={this.state.editModalOpen} nodeDetails={this.state.nodeDetails}/>

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
        ); //End of Return
    } //End of Render
} //End of Class
