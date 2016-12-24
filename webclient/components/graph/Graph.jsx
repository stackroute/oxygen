
import React from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import AutoCompleteSearchBox from './AutoCompleteSearchBox';
import SelectPanel from './SelectPanel';
import {Container, Row, Col} from 'react-grid-system';
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
  padding: 30,
},
place:{
  position:"fixed",
  top: "10%",
  right:"5%",
}
}
export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state={
      domainName:"",
      concepts:[],
      intents:[]
    }
  }

  getIntentsAndConcepts()
  {
    let url =`/domain/`+this.props.params.domainName;
    Request
    .get(url)
    .end((err, res) => {
     if(!err){       
       let domainDetails=JSON.parse(res.text);
       console.log(domainDetails)
       this.setState(
       {
        domainName:domainDetails.Domain,
        concepts:domainDetails.Concepts,
        intents:domainDetails.Intents
      }
      )

     }
   });


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
    <IconButton style={styles.place} iconStyle={styles.largeIcon}><NavigationArrowBack style={styles.large} color={"white"} /></IconButton>

    <Col sm={2}>
    <SelectPanel intents={this.state.intents}/>
    </Col>
    <Col sm={10}>
    <Link to="/dashboard">
    <Row>
    <Col sm={12}>
    <h1 style={{textAlign:"left",color:"#8aa6bd",fontSize:"35pt"}}>{this.state.domainName.toUpperCase()} </h1>
    </Col>
    </Row>
    </Link>
    <AutoCompleteSearchBox concepts={this.state.concepts}/>
    </Col>
    </Row>


    </div>
    );
}
}

