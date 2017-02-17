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
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import {cyan500} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import AddSubject from './AddSubject.jsx';
import AddPredicate from './AddPredicate.jsx';
import DeletePredicate from './DeletePredicate.jsx';
//import DeletePredicate from './DissolveRelation.jsx';
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

const style = {
    margin: 30,
    textAlign: "center",
    fontFamily: "sans-serif"
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
            deletePredicateModalOpen: false,
            stepNumber: 0,
            objectPredicates: [],
            nodeDetails: null,
            openAddSubject: false,
            openAddObject: false,
            openAddPredicate: false,
            nodePredicateDetails:null

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
                } else {
                    var listObjects = [];
                    var listPredicates = [];
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
                    this.setState({predicateList: listPredicates, objectList: listObjects, searchRelText: '', loading: 'hide'});
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
        this.getObjects(searchText.charAt(0), searchText.substr(3, searchText.length));
        if (searchText.length == 0) {
            this.setState({stepNumber: 0});
            console.log("Herer" + this.state.stepNumber);
        } else {
            this.setState({addLabel: 'Add Intent', floatingLabelTextObject: 'Objects', selectedSubject: searchText, stepNumber: 1})
        }
    };

    handleUpdateObjectInput = (searchText) => {
        let predicates = this.state.predicateList[searchText.substr(3, searchText.length)];
        if (searchText.length == 0) {
            this.setState({stepNumber: 1});
        } else {
            this.setState({nodeRelations: predicates, selectedObject: searchText, stepNumber: 2});
        }
    };

    handleUpdatePredicateInput = (searchText) => {
       this.setState({
         selectedPredicate: searchText,
         stepNumber:3
       });
   };

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
        if (this.state.selectedObject.length == 0) {} else {
          let nodetype = '';
              let nodename = this.state.selectedObject.substr(3, this.state.selectedObject.length);
              //console.log(nodename);
              if(this.state.selectedObject.charAt(0) == 'T'){
                nodetype = 'Term';
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


    handleDeletePredicate = () => {
      console.log(this.state.selectedObject);
      console.log(this.state.selectedSubject);
      console.log(this.state.selectedPredicate);
     if(this.state.selectedObject.length == 0 || this.state.selectedSubject.length == 0 || this.state.selectedPredicate.length == 0){
     }
     else{
       let subnodetype = '';
       let objnodetype = '';
       let subnodename = this.state.selectedSubject.substr(3, this.state.selectedSubject.length);
       let objnodename = this.state.selectedObject.substr(3, this.state.selectedObject.length);
       if(this.state.selectedObject.charAt(0) == 'T'){
         objnodetype = 'Term';
       }else{
         objnodetype = 'Concept';
       }
       if(this.state.selectedSubject.charAt(0) == 'I'){
         subnodetype = 'Intent';
       }else{
         subnodetype = 'Concept';
       }
       let nodePredicateDetails = {
         domainName : this.state.selectedDomain,
         subnodetype: subnodetype,
         subnodename: subnodename,
         objnodetype: objnodetype,
         objnodename: objnodename,
         predicate: this.state.selectedPredicate
       };
       this.setState({
           nodePredicateDetails: nodePredicateDetails,
         });
   }
 }

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
                        marginRight: '80%'
                    }}>C - Concept, I - Intent, T - Term</Row>

                    <Row>

                        <Col lg={3} xl={3} md={3} sm={3} xs={3}>
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
                        <Col lg={1} xl={1} md={1} sm={1} xs={1}>
                            <IconButton iconStyle={styles.largeIcon}>
                                <ContentRemove style={{
                                    marginTop: '50%'
                                }}/>
                            </IconButton>
                        </Col>

                        <Col lg={3} xl={3} md={3} sm={3} xs={3}>
                            <Row>
                                <AutoComplete
                                  floatingLabelText={this.state.floatingLabelTextRel}
                                  searchText={this.state.searchRelText} onUpdateInput={this.handleUpdatePredicateInput} onNewRequest={this.handleNewRequest} dataSource={this.state.nodeRelations} filter={AutoComplete.caseInsensitiveFilter} openOnFocus={true} maxSearchResults={5}/>

                            </Row>
                        </Col>
                        <Col lg={1} xl={1} md={1} sm={1} xs={1}>
                            <IconButton iconStyle={styles.largeIcon}>
                                <NavigationArrowForward style={{
                                    marginTop: '50%'
                                }}/>
                            </IconButton>
                        </Col>
                        <Col lg={3} xl={3} md={3} sm={3} xs={3}>
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

                        <RaisedButton label="Dissolve"
                          style={{marginRight:10}}

                          onTouchTap={

                            this.handleDeletePredicate
                          }


                         />


                        <RaisedButton label="Apply"/>
                    </Row>
                    <br/>
                    <Row >
                        <Col lg={4} xl={4} md={4} sm={4} xs={4}>
                            <SubjectCard/>
                        </Col>
                        <Col lg={4} xl={4} md={4} sm={4} xs={4}>
                            <PredicateCard/>
                        </Col>
                        <Col lg={4} xl={4} md={4} sm={4} xs={4}>
                            <ObjectCard/>
                        </Col>
                    </Row>
                    <br/>

                </Paper>
                <AddSubject open={this.state.openAddSubject} domain={this.state.selectedDomain}/>
                <AddObject open={this.state.openAddObject} domain={this.state.selectedDomain} subject={this.state.selectedSubject}/>
                <AddPredicate open={this.state.openAddPredicate} domain={this.state.selectedDomain} subject={this.state.selectedSubject} object={this.state.selectedObject}/>
                <DeleteNode open={this.state.deleteModalOpen} nodeDetails={this.state.nodeDetails}/>
                <Edit open={this.state.editModalOpen} nodeDetails={this.state.nodeDetails}/>
                <DeletePredicate predicateDetails = {this.state.nodePredicateDetails} />

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
