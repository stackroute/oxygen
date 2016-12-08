import React from 'react';
import Dialog from 'material-ui/Dialog';
import Formsy from 'formsy-react';
import FlatButton from 'material-ui/FlatButton';
import {Container, Row, Col} from 'react-grid-system';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import MenuItem from 'material-ui/MenuItem';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
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


export default class EditJobDialog extends React.Component {

  constructor(props) {
    super(props);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.state = {
      open: true,
      canSubmit:false,
      query:props.item.query,
      engineID:props.item.engineID,
      exactTerms:(props.item.exactTerms==="NONE"?"":props.item.exactTerms),
      results:props.item.results,
      siteSearch:(props.item.siteSearch==="NONE"?"":props.item.siteSearch)
    };}


    handleSave = () => {
      this.setState({open: false});
      let newJob = {
        query: this.state.query,
        engineID: this.state.engineID,
        exactTerms:(this.state.exactTerms === "" ? "NONE":this.state.exactTerms),
        results:this.state.results,
        siteSearch:(this.state.siteSearch === "" ? "NONE":this.state.siteSearch)
      };
      console.log("updated obj")
      console.log(newJob)
      this.props.save(newJob);
    };
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
    handleClose = () => {
      this.setState({open: false});

      this.props.cancel();
    };
    enableButton() {
      this.setState({
        canSubmit: true
      });
    }
    disableButton() {
      this.setState({
        canSubmit: false
      });
    }
    render() {
      const actions = [
      <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose}
      />,
      <FlatButton
      label="Save"
      primary={true}
      keyboardFocused={true} type="submit" disabled={!this.state.canSubmit}
      onClick={this.handleSave}
      />];
      let { wordsError, numberError,UrlError} = errorMessages;
      return (
        <div>
        <Dialog
        title="Edit Jobs"
        actions={actions}
        modal={true}
        open={this.state.open}
        contentStyle={customContentStyle}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose}
        >
        <Container>
        <Formsy.Form
        ref="form"
        style={{"padding": '50px 24px'}}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onValidSubmit={this.handleSave.bind(this)}
        >

        <Row>
        <Col lg={3} style={Label}>QUERY</Col>
        <Col lg={9}>
        <FormsyText
        type="text"
        name="query"
        validations="isWords"
        defaultValue={this.state.query}
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
        required
        fullWidth={true}
        value={this.state.engineID}
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
        defaultValue={this.state.exactTerms}
        updateImmediately
        hintText="value"
        style={tfont}
        fullWidth={true} onChange={this.onChangeExactTerms.bind(this)}/></Col>
        </Row>

        <Row>
        <Col lg={3} style={Label}>NO.OF.RESULTS <small> (1-100) </small> </Col>
        <Col lg={9}><FormsyText
        type="number"
        validations="maxLength:2"
        name="results"
        validationError={numberError}
        defaultValue={this.state.results}
        value={this.state.results}
        updateImmediately
        required
        hintText="value"
        style={tfont}
        fullWidth={true} onChange={this.onChangeResults.bind(this)} /></Col>
        </Row>

        <Row>
        <Col lg={3} style={Label}>SITE-SEARCH<small> (Specific-search) </small></Col>
        <Col lg={9}><FormsyText
        type="text"
        name="siteSearch"
        validations="isUrl"
        validationError={UrlError}
        defaultValue={this.state.siteSearch}
        updateImmediately
        hintText="value"
        style={tfont}
        fullWidth={true} onChange={this.onChangeSite.bind(this)}/> </Col>
        </Row>

        </Formsy.Form>
        </Container>
        </Dialog>
        </div>
        );
    }
  }
  EditJobDialog.propTypes = {  
    cancel: React.PropTypes.func,
    save: React.PropTypes.func,
    item: React.PropTypes.object
  }