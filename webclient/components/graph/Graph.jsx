
import React from 'react';
import {Link} from 'react-router';
import AutoCompleteSearchBox from './AutoCompleteSearchBox';
import SelectPanel from './SelectPanel';
import DocResultCard from './DocResultCard';
import SelectedConcepts from './SelectedConcepts';
import {Row, Col} from 'react-grid-system';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Request from 'superagent';
const fonts={
  margin: "0px auto",
  textAlign: "center",
  fontFamily: "sans-serif",
  color: "#1976d2"
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
  position:"fixed",
  top: "10%",
  right:"5%"
}
}
export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state={
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
    if(!newConcepts.includes(concept)){
      newConcepts.push(concept)
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
    let prevDoc=this.state.docs;
    let reqObj={
      domainName:this.state.domainName,
      reqIntents:this.state.checkedIntent,
      reqConcepts:this.state.selectedConcept
    }
    prevDoc.push(reqObj)
    this.setState({
      docs:prevDoc
    })
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
    <Col sm={2}>
    <SelectPanel intents={this.state.intents} getCheckedIntent={this.getCheckedIntents.bind(this)}/>
    </Col>
    <Col sm={10}>  
    <Row>
    <Col sm={12}>    
    <h1 style={{textAlign:"left",color:"#8aa6bd",fontSize:"35pt"}}>
    {this.state.domainName.toUpperCase()} </h1>
    <Link to="/dashboard">  
    <IconButton style={styles.place} iconStyle={styles.largeIcon}>
    <NavigationArrowBack style={styles.large} color={"white"} />
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
    {this.state.selectedConcept.length===0?<h4>SELECT THE CONCEPTS</h4>:
      <SelectedConcepts conceptChips={this.state.selectedConcept}
      deleteConcept={this.deleteConcepts.bind(this)} />}    
      </Col>
      </Row>
      </Col>
      </Row>
      <br/><br/>
      <Row>
      <Col sm={12}> 
      {this.state.docs.length===0?<h1>CLICK SEARCH TO SHOW THE DOCUMENTS</h1>:
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