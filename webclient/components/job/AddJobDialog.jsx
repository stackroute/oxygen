import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Container, Row, Col} from 'react-grid-system';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import MenuItem from 'material-ui/MenuItem';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

const style = {
  position:"fixed",
  bottom: "5%",
  right:"5%"
};

const tfont={
  fontSize:"15px"
}
const Label={paddingLeft:"30px",paddingTop:"20px",fontWeight:"bold"};

const errorMessages= {
  wordsError: "Please only use letters",
  numberError: "Please enter less than 100",
  UrlError:"please enter a URL"
} ;
const customContentStyle = {
  width: '100%',
  height: '100%',
  maxWidth: 'none'
};

export default class AddJobDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.state={job:{},
    canSubmit:false,
    open: false,
    query:"",
    engineID:"eng1"
    ,extraTerms:"",
    results:0,
    siteSearch:""}
  }
  handleSubmit() {
    console.log('on calling handle sumbit while adding job')
    let newJob = {
      query: this.state.query,
      engineID: this.state.engineID,
      extraTerms:(this.state.extraTerms ===""?"NONE":this.state.extraTerms),
      results:this.state.results,
      siteSearch:(this.state.siteSearch ===""?"NONE":this.state.siteSearch)
    };
    this.refs.form.reset();
    this.setState({job:newJob})
    
    this.props.addJob(newJob)
  }
  onChangeQuery(e)
  {
    this.setState({query:e.target.value})
  }
  onChangeEngineID = (event, index, value) => {
    this.setState({engineID:index})
  };
  
  onChangeExtraTerms(e)
  {
    this.setState({extraTerms:e.target.value})
  }
  onChangeResults(e)
  {
    this.setState({results:e.target.value})
  }
  onChangeSite(e)
  {
    this.setState({siteSearch:e.target.value})
  }

  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  enableButton() {
    this.setState(()=>({
      canSubmit: true
    }));
  }
  disableButton() {
    this.setState(()=>({
      canSubmit: false
    }));
  }
  render() {
    const actions = [
    <FlatButton
    label="Cancel"
    primary={true}
    onTouchTap={this.handleClose} />,
    <FlatButton
    label={'Add'} primary={true} type="submit" disabled={!this.state.canSubmit}
    onTouchTap={this.handleClose} onClick={this.handleSubmit.bind(this)}/>
    ];
    let { wordsError, numberError,UrlError} = errorMessages;
    return (
      <div>
      <FloatingActionButton style={style} onTouchTap={this.handleOpen}>
      <ContentAdd />
      </FloatingActionButton>
      <Dialog
      title="Add Job"
      actions={actions}
      modal={true}
      contentStyle={customContentStyle}
      autoScrollBodyContent={true}
      open={this.state.open}
      >
      <Container>
      <Formsy.Form
      ref="form"
      style={{"padding": "50px 24px"}}
      onValid={this.enableButton}
      onInvalid={this.disableButton}
      onValidSubmit={this.handleSubmit.bind(this)}
      >
      <Row>
      <Col lg={3} style={Label}>QUERY</Col>
      <Col lg={9}>
      <FormsyText
      type="text"
      name="query"
      validations="isWords"
      validationError={wordsError}
      updateImmediately
      required
      hintText="value"
      style={tfont}
      fullWidth={true} onChange={this.onChangeQuery.bind(this)}/></Col>
      </Row>
      <Row>
      <Col lg={3} style={Label}>ENGINE-ID</Col>
      <Col lg={9}><FormsySelect
      name="engines"
      value={this.state.engineID}
      required
      fullWidth={true}
      onChange={this.onChangeEngineID.bind(this)}
      >
      <MenuItem value="eng1" primaryText="engine-1" />
      <MenuItem value="eng2" primaryText="engine-2" />
      <MenuItem value="eng3" primaryText="engine-3" />

      </FormsySelect></Col>
      </Row>
      <Row>
      <Col lg={3} style={Label}>EXTRA-TERMS</Col>
      <Col lg={9}><FormsyText
      type="text"
      name="extraTerms"
      validations="isWords"
      validationError={wordsError}
      updateImmediately
      hintText="value"
      style={tfont}
      fullWidth={true} onChange={this.onChangeExtraTerms.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>NO.OF.RESULTS <small> (1-100) </small> </Col>
      <Col lg={9}><FormsyText
      type="number"
      name="results"
      validations="maxLength:2"
      validationError={numberError}
      updateImmediately
      required
      hintText="value"
      //value={this.state.query==0?"":this.state.query}
      style={tfont}
      fullWidth={true} onChange={this.onChangeResults.bind(this)}/></Col>
      </Row>
      <Row>
      <Col lg={3} style={Label}>SITE-SEARCH<small> (Specific-search) </small></Col>
      <Col lg={9}><FormsyText
      type="text"
      validations="isUrl"
      validationError={UrlError}
      updateImmediately
      hintText="value"
      name="siteSearch"
      style={tfont}
      fullWidth={true} onChange={this.onChangeSite.bind(this)}/></Col>
      </Row>

      </Formsy.Form>
      </Container>
      </Dialog>
      </div>
      );
  }
}
