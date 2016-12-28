
import React from 'react';
import {Link} from 'react-router';
import AutoCompleteSearchBox from './AutoCompleteSearchBox';
import SelectPanel from './SelectPanel';
import DocResultCard from './DocResultCard';
import SelectedConcepts from './SelectedConcepts';
import {Row, Col,ScreenClassRender,Visible} from 'react-grid-system';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import Request from 'superagent';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
const iPanel={
  minWidth:150,
  backgroundColor:"#dadada",
  minHeight:680
}
const fonts={
  margin: "0px auto",
  textAlign: "center",
  fontFamily: "sans-serif",
  color: "#1976d2"
}
const suggest={
  color:"grey"
}
const drawer={
  paddingLeft:0,
  paddingRight:0
}
const styles={
 largeIcon: {

  width: 28,
  height: 28,
  backgroundColor: "#a9a9a9",
  padding: 10,
  borderRadius: 60
},
large: {
  width: 120,
  height: 120,
  padding: 30
}
}
const styleFunction = (screenClass) => {
  if (screenClass === 'xl') return { fontSize: '37px',textAlign:"left",color:"#8aa6bd" };
  if (screenClass === 'lg') return { fontSize: '35px',textAlign:"left",color:"#8aa6bd" };
  if (screenClass === 'md') return { fontSize: '30px',textAlign:"left",color:"#8aa6bd" };
  if (screenClass === 'sm') return { fontSize: '28px',textAlign:"left",color:"#8aa6bd" };
  return { fontSize: '25px',textAlign:"left",color:"#8aa6bd" };
};
export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state={
      msgCaption:"FIND YOUR SUGGESTED DOCUMENTS HERE",
      domainName:"",
      concepts:[],
      intents:[],
      docs:[],
      checkedIntent:[],
      selectedConcept:[],
      open:false
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  getConcepts(concept)
  {
    let newConcepts=this.state.selectedConcept;
    if(this.state.concepts.includes(concept))
    {
      if(!newConcepts.includes(concept)){
        newConcepts.push(concept)
      }
    }

    this.setState({
      selectedConcept:newConcepts
    })
    console.log("selected concept")
    console.log(newConcepts)
  }

  getCheckedIntents(event,checked)
  {
    let prevIntents=this.state.checkedIntent
    if(checked){
      prevIntents.push(event.target.value);
    }
    else{
      prevIntents=prevIntents.filter(function(data) {
        return data!==event.target.value;

      });
    }
    this.setState({
      checkedIntent:prevIntents
    })
    console.log("checked intents")
    console.log(prevIntents)
  }
  deleteConcepts(data){
    let delConcepts=this.state.selectedConcept;
    delConcepts=delConcepts.filter(function(concept){
     return concept!==data;
   })
    this.setState(
    {
      selectedConcept:delConcepts
    })
  }
  getIntentsAndConcepts()
  {
    let url =`/domain/`+this.props.params.domainName;
    let that=this;
    Request
    .get(url)
    .end((err, res) => {
     if(!err){
       let domainDetails=JSON.parse(res.text);
       console.log("from the grph whole data")
       console.log(domainDetails)
       that.setState(
       {
        domainName:domainDetails.Domain,
        concepts:domainDetails.Concepts,
        intents:domainDetails.Intents
      })
     }
   });
  }
  searchDocuments()
  {
    if(this.state.selectedConcept.length===0)
    {
      this.setState({
        msgCaption:"SORRY NO SUGGESTED DOCUMENTS TRY AGAIN",
        docs:[]
      })
    }

    else{
      let reqObj={
        domainName:this.state.domainName,
        reqIntents:this.state.checkedIntent,
        reqConcepts:this.state.selectedConcept
      }
      this.setState({
        docs:[]
      })

      let url =`/domain/documents/`+reqObj.domainName;
      Request
      .post(url)
      .send(reqObj)
      .end((err, res) => {
        if(err) {
    //res.send(err);
    this.setState({errmsg: res.body});
  }
  else {
    console.log("Response on documents show: ", JSON.parse(res.text));
    let response=JSON.parse(res.text);
    if(typeof response==="undefined" || response.length===0 )
    {
      this.setState({
        msgCaption:"SORRY NO SUGGESTED DOCUMENTS TRY AGAIN"
      })
    }
    this.setState({
      docs:response
    })
  }
});
    }

  }
  componentDidMount()
  {
   this.getIntentsAndConcepts();

 }
 render()
 {
  return(
    <div style={fonts}>

    <Row>
    <Visible  lg xl>
    <Col sm={12} xs={12} md={2} lg={2} xl={2} style={iPanel}>
    <SelectPanel intents={this.state.intents} getCheckedIntent={this.getCheckedIntents.bind(this)}/>
    </Col>
    <Col sm={12} xs={12} md={10} lg={10} xl={10} style={{maxWidth:2000}}>
    <Row>
    <Col lg={12} md={12} sm={12} xs={12}>
    <ScreenClassRender style={styleFunction}>
    <h1>
    {this.state.domainName.toUpperCase()}
    </h1>
    </ScreenClassRender>
    </Col>
    </Row>
    <Row>
    <Col sm={12} xs={12} md={12} lg={12} xl={12}>
    <AutoCompleteSearchBox concepts={this.state.concepts}
    searchDocument={this.searchDocuments.bind(this)}
    getConcept={this.getConcepts.bind(this)}/>
    <Row>
    <Col sm={12}>
    {this.state.selectedConcept.length===0?<h4 style={{color:"#8aa6bd"}}>SELECT THE CONCEPTS</h4>:
    <SelectedConcepts conceptChips={this.state.selectedConcept}
    deleteConcept={this.deleteConcepts.bind(this)} />}
    </Col>
    </Row>
    </Col>
    </Row>
    <br/><br/>
    <Row>
    <Col sm={8}>
    {this.state.docs.length===0?<h2 style={suggest}>{this.state.msgCaption}</h2>:
    <DocResultCard webDocs={this.state.docs}/>}
    </Col>
    </Row>
    </Col>
    </Visible>


    <Visible  style={{padding:0}} md sm xs>

    <Drawer open={this.state.open}
    onRequestChange={this.handleToggle}
    docked={false}
    >
    <MenuItem><SelectPanel intents={this.state.intents}
      
    getCheckedIntent={this.getCheckedIntents.bind(this)}/></MenuItem>
    </Drawer>

    <Col sm={12} xs={12} md={12}style={{maxWidth:2000}}>
    <Row>
    <Col md={10} sm={10} xs={10}>
    <ScreenClassRender style={styleFunction}>
    <h1>
    {this.state.domainName.toUpperCase()}
    </h1>
    </ScreenClassRender>
    </Col>
    <Col md={2} sm={2} xs={2}>
    <IconButton iconStyle={styles.largeIcon} onTouchTap={this.handleToggle} >
    <NavigationMenu style={styles.large} color={"white"} />
    </IconButton>
    </Col>
    </Row>
    <Row>
    <Col sm={12} xs={12} md={12} lg={12} xl={12}>
    <AutoCompleteSearchBox concepts={this.state.concepts}
    searchDocument={this.searchDocuments.bind(this)}
    getConcept={this.getConcepts.bind(this)}/>
    <Row>
    <Col sm={12}>
    {this.state.selectedConcept.length===0?<h4 style={{color:"#8aa6bd"}}>SELECT THE CONCEPTS</h4>:
    <SelectedConcepts conceptChips={this.state.selectedConcept}
    deleteConcept={this.deleteConcepts.bind(this)} />}
    </Col>
    </Row>
    </Col>
    </Row>
    <br/><br/>
    <Row>
    <Col sm={12}>
    {this.state.docs.length===0?<h2 style={suggest}>{this.state.msgCaption}</h2>:
    <DocResultCard webDocs={this.state.docs}/>}
    </Col>
    </Row>
    </Col>
    </Visible>
    </Row>
    </div>
    );
}
}

Graph.propTypes = {
  params: React.PropTypes.object
}
