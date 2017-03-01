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
import DissolveRelation from './DissolveRelation.jsx';
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
import lime800 from 'material-ui/styles/colors';
import SubjectCard from './SubjectCard.jsx';
import HorizontalLinearStepper from './HorizontalLinearStepper.jsx';
import {Tabs, Tab} from 'material-ui/Tabs';
import DeleteNode from './DeleteNode.jsx';
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
import FormStatement from './FormStatement';
import Notification from './Notification.jsx';
import {Link} from 'react-router';


const style = {
    margin: 30,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    overflowX: 'hidden'
};

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
            floatingLabelTextSubject: 'Subject',
            floatingLabelTextObject: 'Object',
            floatingLabelTextRel: 'Predicate',
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
            nodePredicateDetails: null,
            selectedSubjectDetails: null,
            selectedObjectDetails: null,
            selectedPredicateDetails: null,
            subjectCardJsx: '',
            objectCardJsx: '',
            predicateCardJsx: '',
            statementFormed: false,
            addNewSubject: false,
            addNewObject: false,
            enablePredicate: false,
            dissolveModalOpen: false,
            subjectDetailList: [],
            applyChangesDisabled: true,
            dissolvePredicate: false
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
                    this.setState({floatingLabelTextObject: 'No Results'});
                } else {
                    var listSubjects = [];
                    for (let each in response['subjects']) {
                        let nodekey = response['subjects'][each].label;
                        listSubjects.push(nodekey.charAt(0) + ': ' + response['subjects'][each]['name']);
                    }
                    this.setState({
                      selectedSubjectDetails: response.attributes,
                      subjectList: listSubjects,
                      searchObjectText: '',
                      loading: 'hide',
                      subjectDetailList: response['subjects']
                    });
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
                default:
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
                    this.setState({floatingLabelTextObject: 'No Results'});
                } else {
                    var listObjects = [];
                    var listPredicates = [];
                    let nodeDetails = {};
                    for (let each in response['objects']) {
                        let label;
                        if (nodeType == 'C') {
                            label = 'C';
                        } else {
                            label = 'T';
                        }
                        let nodekey = response['objects'][each]['name'];

                        listObjects.push(label + ': ' + response['objects'][each]['name']);

                        // console.log(nodekey);
                        listPredicates[response['objects'][each]['name']] = response['objects'][each]['predicates'];
                    }
                    this.setState({predicateList: listPredicates, objectList: listObjects, searchRelText: '', loading: 'hide'});
                }
            }
        });
    }

    enableButton() {
        this.setState({canSubmit: true});
    }

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
            // stepNumber:0
        });
      };

    // Use this to send for object creation line 220
    handleUpdateSubjectInput = (searchText) => {
        let selectedSubjectDetails = {};
        if (this.state.subjectList.indexOf(searchText) < 0 || searchText.length == 0) {
            this.setState({stepNumber: 0});
        } else {
            this.setState({addLabel: 'Add Intent', floatingLabelTextObject: 'Objects', selectedSubject: searchText, stepNumber: 1});
            this.getObjects(searchText.charAt(0), searchText.substr(3, searchText.length));
            let nodeName = searchText.substr(3, searchText.length);
            let url = '';
            let nodeType = '';
            switch (searchText.charAt(0)) {
                case 'C':
                    nodeType = 'Concept';
                    url = `/domain/${this.state.selectedDomain}/subject/concept/${nodeName}/objects`;
                    break;
                case 'I':
                    nodeType = 'Intent';
                    url = `/domain/${this.state.selectedDomain}/subject/intent/${nodeName}/objects`;
                    break;
                default:
            }

            let details = this.state.subjectDetailList.find((node) => {
              return node.name === nodeName;
            });

            selectedSubjectDetails['subname'] = nodeName;
            selectedSubjectDetails['subtype'] = nodeType;
            selectedSubjectDetails['attributes'] = details.attributes;
            this.setState({
              selectedSubjectDetails: selectedSubjectDetails,
              subjectCardJsx: 'old'
            });
        }
    };

    handleUpdateObjectInput = (searchText) => {
        let selectedObjectDetails = {};
        if (this.state.objectList.indexOf(searchText) < 0 || searchText.length == 0) {
            this.setState({stepNumber: 1});
        } else {
            let predicates = this.state.predicateList[searchText.substr(3, searchText.length)];
            this.setState({nodeRelations: predicates, selectedObject: searchText, stepNumber: 2});
            let nodeName1 = this.state.selectedSubject.substr(3, this.state.selectedSubject.length - 1);
            let nodeName2 = searchText.substr(3, searchText.length - 1);
            let nodeType = '';
            let url = '';
            switch (this.state.selectedSubjectDetails['subtype'].charAt(0)) {
                case 'C':
                    nodeType = 'Concept';
                    url = `/domain/${this.state.selectedDomain}/subject/Concept/${nodeName1}/object/Concept/${nodeName2}`;
                    break;
                case 'I':
                    nodeType = 'Term';
                    url = `/domain/${this.state.selectedDomain}/subject/Intent/${nodeName1}/object/Term/${nodeName2}`;
                    break;
                    default:
            }
            Request.get(url).end((err, res) => {
                if (err) {
                    this.setState({errmsg: res.body, loading: 'hide'});
                } else {
                    let response = JSON.parse(res.text);
                    if (response.length == 0) {
                        this.setState({floatingLabelTextObject: 'No Results'});
                    } else {
                        selectedObjectDetails['objname'] = nodeName2;
                        selectedObjectDetails['objtype'] = nodeType;
                        selectedObjectDetails['attributes'] = response;
                        this.setState({selectedObjectDetails: selectedObjectDetails, objectCardJsx: 'old'});
                    }
                }
            });
        }
    };

    handleUpdatePredicateInput = (searchText) => {
        if (searchText.length == 0) {
            this.setState({stepNumber: 2});
          } else {
            this.setState({selectedPredicate: searchText, stepNumber: 3});
            let selectedPredicateDetails = {};
            selectedPredicateDetails['domainName'] = this.state.selectedDomain;
            selectedPredicateDetails['subname'] = this.state.selectedSubjectDetails['subname'];
            selectedPredicateDetails['subtype'] = this.state.selectedSubjectDetails['subtype'];
            selectedPredicateDetails['objname'] = this.state.selectedObjectDetails['objname'];
            selectedPredicateDetails['objtype'] = this.state.selectedObjectDetails['objtype'];
            let nodeName1 = this.state.selectedObjectDetails['subname'];
            let nodeName2 = this.state.selectedObjectDetails['objname'];

            let url = '';
            switch (this.state.selectedSubjectDetails['subtype'].charAt(0)) {
                case 'C':
                    url = `/domain/${this.state.selectedDomain}/subject/Concept/${nodeName1}/object/Concept/${nodeName2}/predicates/${searchText}`;
                    break;
                case 'I':
                    url = `/domain/${this.state.selectedDomain}/subject/Intent/${nodeName1}/object/Term/${nodeName2}/predicates/${searchText}`;
                    break;
                    default:
            }
            Request.get(url).end((err, res) => {
                if (err) {
                    this.setState({errmsg: res.body, loading: 'hide'});
                } else {
                    let response = JSON.parse(res.text);
                    selectedPredicateDetails['name'] = searchText;
                    try{
                      selectedPredicateDetails['attributes'] = response.records[0]._fields[0]['properties'];
                    } catch(e) {
                      selectedPredicateDetails['attributes'] = [];
                    }
                    this.setState({
                      selectedPredicateDetails: selectedPredicateDetails,
                      predicateCardJsx: 'old',
                      enablePredicate: true,
                    });
                }
            });
        }
    };
    // handleUpdateRelInput = (searchText) => {
    //
    // };

    handleUpdateDeletePredicate = () => {
        this.setState({
          selectedPredicateDetails: null,
          stepNumber: 2
        });
        this.dissolveModal();
        console.log('Here after dissolve');
    };

    handleChange = (event, index, value) => this.setState({value});

    handleNewRequest = () => {
        this.setState({searchSubjectText: '', searchObjectText: '', searchRelText: ''});
    };

    formStatement = () => {
        if (this.state.selectedSubjectDetails !== null) {
            this.setState({statementFormed: true});
        }
    }

    addNewSubject = () => {
      this.setState({
        subjectCardJsx: 'new',
        selectedSubjectDetails: null,
        selectedObjectDetails: null,
        selectedPredicateDetails: null,
        objectCardJsx: ''
      });
    }

    addNewObject = () => {
      this.setState({
        objectCardJsx: 'new',
        selectedObjectDetails: null,
      });
    }

    updateSubject = (details) => {
      this.setState({
        selectedSubjectDetails: details,
        subjectCardJsx: 'old',
        applyChangesDisabled: false
      });
    }

    updateObject = (details) => {
      this.setState({
        selectedObjectDetails: details,
        enablePredicate: true,
        objectCardJsx: 'old',
        applyChangesDisabled: false
      });
    }

    updatePredicate = (details) => {
      this.setState({
        selectedPredicateDetails: details,
        applyChangesDisabled: false
      });
    }

    dissolveModal = () => {
      let status = !this.state.dissolveModalOpen;
      this.setState({
        dissolveModalOpen: status
      });
    };

    updateData = () => {
      console.log('data');
    };

    handleDeletePredicate = () => {
      this.setState({
        dissolvePredicate: true
      });
    }

    render() {
        let {paperStyle, switchStyle, submitStyle} = styles;
        const {stepIndex} = this.state;
        return (
            <div styles={styles.div}>
                <div style={{
                    textAlign: 'center',
                    fontFamily: 'sans-serif',
                    color: 'rgb(0,128, 128)',
                    marginTop: '5%'
                }}>
                    <h1>{this.state.selectedDomain}
                      <FlatButton label='Browser' primary={true} containerElement = {<Link to = {'/domainhome/'+this.state.selectedDomain}/>} style={{
                              float: 'right',
                              marginRight: 50
                          }}/>
                      <FlatButton label='Graph View' primary={true} containerElement = {<Link to = {'/domainview/'+this.state.selectedDomain}/>} style={{
                              float: 'right',
                              marginRight: 50
                          }}/>
                    </h1>

                </div>
                <br/>
                <Paper style={style}>
                    <HorizontalLinearStepper stepNumber={this.state.stepNumber}/>

                    <Row style={{
                        float: 'left',
                        marginLeft: 20
                    }}>C - Concept, I - Intent, T - Term</Row>

                    <Row>
                      <br/>
                        <Col lg={4} xl={4} md={4} sm={12} xs={12}>
                            <Row>
                                <AutoComplete floatingLabelText={this.state.floatingLabelTextSubject} searchText={this.state.searchSubjectText} onUpdateInput={this.handleUpdateSubjectInput} onNewRequest={this.handleNewRequest} dataSource={this.state.subjectList} filter={AutoComplete.caseInsensitiveFilter} openOnFocus={true} maxSearchResults={5}/>
                            </Row>
                            <Row style={{
                                marginLeft: 170
                            }}>
                                <FlatButton label='Add New' onTouchTap={this.addNewSubject} labelStyle={{
                                    fontSize: 10
                                }}/>
                            </Row>
                        </Col>

                        <Col lg={4} xl={4} md={4} sm={12} xs={12}>
                            <Row>
                                <AutoComplete floatingLabelText={this.state.floatingLabelTextRel} searchText={this.state.searchRelText} onUpdateInput={this.handleUpdatePredicateInput} onNewRequest={this.handleNewRequest} dataSource={this.state.nodeRelations} filter={AutoComplete.caseInsensitiveFilter} openOnFocus={true} maxSearchResults={5}/>
                            </Row>
                        </Col>

                        <Col lg={4} xl={4} md={4} sm={12} xs={12}>
                            <Row>
                                <AutoComplete floatingLabelText={this.state.floatingLabelTextObject} searchText={this.state.searchObjectText} onUpdateInput={this.handleUpdateObjectInput} onNewRequest={this.handleNewRequest} dataSource={this.state.objectList} filter={AutoComplete.caseInsensitiveFilter} openOnFocus={true} maxSearchResults={5}/>
                            </Row>
                            <Row style={{
                                marginLeft: 170
                            }}>
                                <FlatButton label='Add New' onTouchTap={this.addNewObject} labelStyle={{
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
                      {
                        this.state.selectedPredicateDetails !== null &&
                        <RaisedButton label='Dissolve' style={{
                            float: 'left',
                            marginRight: 10,
                            marginBottom: 10
                        }} onTouchTap={this.dissolveModal}/>
                      }
                        <RaisedButton label='Save' primary={true} disabled={this.state.applyChangesDisabled} style={{
                            float: 'left',
                            marginRight: 10,
                            marginBottom: 10
                        }} primary={true} onTouchTap={this.formStatement}/>
                    </Row>
                    <br/>
                    <Row>
                        <SubjectCard
                          subjectCard={this.state.selectedSubjectDetails}
                          subjectCardJsx={this.state.subjectCardJsx}
                          updateSubjectCard={this.updateSubject}
                          selectedDomain={this.state.selectedDomain}
                        />
                        <PredicateCard
                          enable = {this.state.enablePredicate}
                          predicateCard={this.state.selectedPredicateDetails}
                          predicateCardJsx={this.state.predicateCardJsx}
                          updatePredicateCard={this.updatePredicate}
                          selectedSubject = {this.state.selectedSubjectDetails}
                        />
                        <ObjectCard
                          objectCard={this.state.selectedObjectDetails}
                          objectCardJsx={this.state.objectCardJsx}
                          updateObjectCard={this.updateObject}
                          selectedSubject = {this.state.selectedSubjectDetails}
                          selectedDomain={this.state.selectedDomain}
                        />
                    </Row>
                    <br/>
                </Paper>
                <FormStatement domain={this.state.selectedDomain} ready={this.state.statementFormed} subject={this.state.selectedSubjectDetails} object={this.state.selectedObjectDetails} predicate={this.state.selectedPredicateDetails}/>
                <DissolveRelation dissolvePredicate = {this.state.dissolvePredicate} predicateDetails={this.state.selectedPredicateDetails} nullPredicate={this.handleUpdateDeletePredicate}/>
                <Dialog
                  title="Confirm to delete"
                  modal={true}
                  open={this.state.dissolveModalOpen}
                  autoScrollBodyContent={true}
                  >
                  <RaisedButton
                    label='Confirm'
                    primary={true}
                     style={{
                      float: 'left',
                      margin: '10'
                  }} onTouchTap={this.handleDeletePredicate}/>

                <RaisedButton label='Cancel'
                  default={true}
                   style={{
                      float: 'left',
                      margin: '10'
                  }} onTouchTap={this.dissolveModal}/>
                </Dialog>
                <Notification updateData={this.updateData.bind(this)} />
            </div>
        );
        // End of Return
    }
    // End of Render
}
 // End of Class
