
import React from 'react';
import {Link} from 'react-router';
import AutoCompleteSearchBox from './AutoCompleteSearchBox';
import SelectPanel from './SelectPanel';
import DocResultCard from './DocResultCard';
import SelectedConcepts from './SelectedConcepts';
import {Row, Col,ScreenClassRender} from 'react-grid-system';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import Request from 'superagent';
const fonts={
  margin: "0px auto",
  textAlign: "center",
  fontFamily: "sans-serif",
  color: "#1976d2"
}
const suggest={
  float:'left',
  color:"grey"
}
const styles={
 largeIcon: {

  width: 30,
  height: 30,
  backgroundColor: "grey",
  padding: 10,
  borderRadius: 60
},
large: {
  width: 120,
  height: 120,
  padding: 30
},
place:{
  position:"relative",
  marginTop: "10%",
  marginRight:"5%"
}
}
const styleFunction = (screenClass) => {
  if (screenClass === 'xl') return { fontSize: '35px' };
  if (screenClass === 'lg') return { fontSize: '35px' };
  if (screenClass === 'md') return { fontSize: '25px' };
  if (screenClass === 'sm') return { fontSize: '18px' };
  return { fontSize: '15px' };
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
      selectedConcept:[]
    }
  }
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
    <Col sm={12} xs={12} md={2} lg={2} xl={2}>
    <SelectPanel intents={this.state.intents} getCheckedIntent={this.getCheckedIntents.bind(this)}/>
    </Col>
    <Col sm={12} xs={12} md={10} lg={10} xl={10}>
    <Row>
    <Col>
    <ScreenClassRender style={styleFunction}>
    <h1 style={{textAlign:"left",color:"#8aa6bd"}}>
    {this.state.domainName.toUpperCase()} </h1>
    </ScreenClassRender>
    <Link to="/dashboard">
    <IconButton style={styles.place} iconStyle={styles.largeIcon}>
    <ActionHome style={styles.large} color={"white"} />
    </IconButton>
    </Link>
    </Col>
    </Row>
    <Row>
    <Col sm={12}>
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
      </Row>
      </div>
      );
}
}

Graph.propTypes = {
  params: React.PropTypes.object
}
