import React from 'react';
import Dialog from 'material-ui/Dialog';
import Formsy from 'formsy-react';
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
    engineID:"009216953448521283757:ibz3hdutpom AIzaSyAZlmGbpm66fk3sHXENieM61djlueEds9Y",
    exactTerms:"",
    results:0,
    siteSearch:""}
  }
  handleSubmit() {
    console.log('on calling handle sumbit while adding job')
    let newJob = {
      query: this.state.query,
      engineID: this.state.engineID,
      exactTerms:(this.state.exactTerms ===""?"NONE":this.state.exactTerms),
      results:this.state.results,
      siteSearch:(this.state.siteSearch ===""?"NONE":this.state.siteSearch)
    };
    this.refs.form.reset();
    this.setState({job:newJob})
    console.log(newJob)
    this.props.addJob(newJob)
  }
  onChangeQuery(e)
  {
    this.setState({query:e.target.value})
  }
  onChangeEngineID = (event, index) => {
    this.setState({engineID:index})
  };
  
  onChangeExactTerms(e)
  {
    this.setState({exactTerms:e.target.value})
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
      <MenuItem value="009216953448521283757:ibz3hdutpom AIzaSyAZlmGbpm66fk3sHXENieM61djlueEds9Y" 
      primaryText="Engine - A" />
      <MenuItem value="015901048907159908775:bu8jkb0g1c0 AIzaSyBb4sbJNrnGmPmHiwEOxtF_ZEbcRBzNr60" 
      primaryText="Engine - B" />
      <MenuItem value="017039332294312221469:tjlfw4hfuwc AIzaSyAkZ_luP7pNchE_V2EMeiw2AwE7kKmbQVY" 
      primaryText="Engine - C" />
      </FormsySelect></Col>
      </Row>
      <Row>
      <Col lg={3} style={Label}>EXACT-TERMS</Col>
      <Col lg={9}><FormsyText
      type="text"
      name="exactTerms"
      validations="isWords"
      validationError={wordsError}
      updateImmediately
      hintText="value"
      style={tfont}
      fullWidth={true} onChange={this.onChangeExactTerms.bind(this)}/></Col>
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
AddJobDialog.propTypes = {  
  addJob: React.PropTypes.func
}