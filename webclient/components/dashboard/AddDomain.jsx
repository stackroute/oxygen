import React from 'react';
import Dialog from 'material-ui/Dialog';
import Formsy from 'formsy-react';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Container, Row, Col,Visible} from 'react-grid-system';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import Request from 'superagent';
// const defaultImgURL='http://corevitality.com/'+
// 'wp-content/uploads/2015/08/27114989-Coming-soon-blue'+
// '-grunge-retro-style-isolated-seal-Stock-Photo.jpg'
const defaultImgURL='./../../assets/images/bulb.png';
const style = {
  position:"fixed",
  bottom: "5%",
  right:"5%"
};
const styleAvg = {
  position:"relative",
  marginBottom: "5%"
};
const tfont={
  fontSize:"15px"
}
const titleDialog={
  color: "#858586",
  fontSize: 30,
  backgroundColor: "#c7c7c7"

}
const Label={paddingLeft:"15px",paddingTop:"20px",fontWeight:"bold",color:"grey"};

const errorMessages= {
  limitError: "Domain length can't be more than 15",
  DuplicationError: "domain name should be unique"
} ;

export default class AddDomain extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.state={domains:[],
      errMsg:'',
    canSubmit:false,
    open: false,
    subject:'',
    description:'',
    imageUrl:defaultImgURL
  }
}
domianFetch()
{
  let url =`/domain/domains`;

  Request
  .get(url)
  .end((err, res) => {
    if(err) {
    //res.send(err);
    this.setState({errMsg: res.body});
  }

  else {
    console.log("Response on show in child: ", JSON.parse(res.text));
    //let domainList1=this.state.domainList;
    let response=JSON.parse(res.text);
    if(response.length===0)
    {
      this.setState({domains:[]});
    }
    else {
      this.setState({domains:response});
    }
  }
});
}

componentDidMount()
{
  this.domianFetch();
}

handleSubmit() {
  console.log('on calling handle sumbit while adding domain');
  console.log(this.state.imageUrl)
  let sub=this.state.subject;
  sub=sub.replace(/\b[a-z]/g,function(f){return f.toUpperCase();});

  console.log('going to ADD '+this.state.imageUrl);
  let domain = {
    name:sub,
    description:this.state.description,
    domainImgURL:this.state.imageUrl
      //domainImgURL:'./../../assets/images/soon.png',
    };
    if(domain.domainImgURL===""|| domain.domainImgURL.length<=5)
    {
      domain.domainImgURL=defaultImgURL;
    }
    this.refs.form.reset();
    this.setState({domain:domain})
    this.setState(
      {imageUrl:defaultImgURL})
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
  onChangeImageUrl(e)
  {
    this.setState({imageUrl:e.target.value})
    if(this.state.imageUrl==='')
    {
      this.setState(
        {imageUrl:'http://corevitality.com/'+
        'wp-content/uploads/2015/08/27114989-Coming-soon-blue-grunge-retro-style-'+
        'isolated-seal-Stock-Photo.jpg'})
    }
    console.log(this.state.imageUrl);
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
    secondary={true}
    onTouchTap={this.handleClose} />,
    <FlatButton
    label={'Add'} primary={true} type="submit" disabled={!this.state.canSubmit}
    onTouchTap={this.handleClose} onClick={this.handleSubmit}/>
    ];
    let {wordsError, DuplicationError} = errorMessages;
    let domainAr=this.state.domains;
    let domainArr=[];
    for(let it in domainAr)
    {
     domainArr.push(domainAr[it].name);
    }
    console.log("The domain arr"+domainArr);
    Formsy.addValidationRule('isIn', function (values, value) {
    return domainArr.indexOf(value) < 0;
    });
    return (
      <div>
      <Visible xl lg>
      <FloatingActionButton style={style} onTouchTap={this.handleOpen}>
      <ContentAdd />
      </FloatingActionButton>
      </Visible>
      <Visible xs sm md>
      <FloatingActionButton style={styleAvg} onTouchTap={this.handleOpen}>
      <ContentAdd />
      </FloatingActionButton>
      </Visible>
      <Dialog
      title="Add Domain"
      titleStyle={titleDialog}
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
      onValidSubmit={this.handleSubmit}
      >
      <Row>
      <Col lg={3} style={Label}>DOMAIN</Col>
      <Col lg={9}>
      <FormsyText
      type="text"
      name="domain"
      validations="isIn"
      validationError={DuplicationError}
      fullWidth={true}
      updateImmediately
      required
      hintText="Name of the Domain"
      style={tfont} onChange={this.onChangeSubject.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>DESCRIPTION</Col>
      <Col lg={9}><FormsyText
      type="textarea"
      name="description"
      validationError={wordsError}
      updateImmediately
      required
      hintText="Some words about the Domain"
      style={tfont}
      fullWidth={true} onChange={this.onChangeDescription.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>IMAGE URL</Col>
      <Col lg={9}><FormsyText
      type="textarea"
      name="imageUrl"
      validationError={wordsError}
      updateImmediately
      hintText="Image url to be displayed"
      style={tfont}
      fullWidth={true} onChange={this.onChangeImageUrl.bind(this)}/></Col>
      </Row>

      </Formsy.Form>
      </Container>
      </Dialog>
      </div>
      );
  }
}
AddDomain.propTypes = {
  addDomain: React.PropTypes.func
}
