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
  numberError: "Please enter less than 100"
} ;
const customContentStyle = {
  width: '100%',
  height: '100%',
  maxWidth: 'none'
};

export default class AddDomain extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.state={domain:{},
    canSubmit:false,
    open: false,
    subject:"",
    description:""}
  }
  handleSubmit() {
    console.log('on calling handle sumbit while adding job');
    var d=new Date();
    var dte=""+d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();
    let domain = {
      subject: this.state.subject,
      description:this.state.description,
      user:'Admin',
      creationDate:dte,
      concepts:0,
      image:'./../../assets/images/soon.png',
      intents:[
    		{intent:'basic',docs: 0},
    		{intent:'tutorial',docs: 0},
    		{intent:'example',docs: 0},
    		{intent:'manual',docs: 0},
    		{intent:'completeReference',docs: 0},
    	 ]
    };
    this.refs.form.reset();
    this.setState({domain:domain})
    console.log(domain);
    this.props.addDomain(domain);
  }
  onChangeSubject(e)
  {
    this.setState({subject:e.target.value})
    console.log(this.state.subject);
  }
  onChangeDescription(e)
  {
    this.setState({description:e.target.value})
    console.log(this.state.description);
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
      title="Add Domain"
      actions={actions}
      modal={true}
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
      <Col lg={3} style={Label}>DOMAIN</Col>
      <Col lg={9}>
      <FormsyText
      type="text"
      name="domain"
      validations="isWords"
      validationError={wordsError}
      updateImmediately
      required
      hintText="value"
      style={tfont} onChange={this.onChangeSubject.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>DESCRIPTION</Col>
      <Col lg={9}><FormsyText
      type="textarea"
      name="description"
      validations="isWords"
      validationError={wordsError}
      updateImmediately
      required
      hintText="value"
      style={tfont}
      fullWidth={true} onChange={this.onChangeDescription.bind(this)}/></Col>
      </Row>


      </Formsy.Form>
      </Container>
      </Dialog>
      </div>
      );
  }
}
