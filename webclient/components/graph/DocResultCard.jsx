import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Row, Col,Visible,ScreenClassRender} from 'react-grid-system';
import Paper from 'material-ui/Paper';

const styleFunction = (screenClass) => {
  if (screenClass === 'xl') {return {fontSize:18,color:"#1976d2"};}
  if (screenClass === 'lg') {return {fontSize:18,color:"#1976d2"};}
  if (screenClass === 'md') {return {fontSize:18,color:"#1976d2"};}
  if (screenClass === 'sm') {return {fontSize:18,color:"#1976d2"};}
  return {fontSize:15,color:"#1976d2 "};
};
const jobcard={
  padding: 0,
  fontWeight: "bold",
  textAlign:"left"
}

const layout={
  maxWidth:1050,
  width:"auto",
  margin:" 30px auto 0",
  borderRadius:7
};
export default class DocResultCard extends React.Component {
  constructor(props) {
    super(props);
    console.log(" props from the result doc card component")
    console.log(props)

  }
  render() {
    return (
      <Paper zDepth={4} style={layout} rounded={false}>
      <Row>
      <Col lg={10} xl={10} md={10} sm={12} xs={12} style={{paddingRight:0}}>
      <Card style={{paddingBottom:15}}>
      <CardHeader style={jobcard}
      textStyle={{padding:0,color:'grey'}}
      titleStyle={{"fontSize":"18pt",padding:"16px 16px 0",color:'grey'}}
      title={this.props.webDoc.title}
      />
      <CardText style={{textAlign: "left",padding:"0px 16px"}}>
      <p style={{color:"gray"}}><b>Description :
      </b>{this.props.webDoc.description}
      </p>
      <Visible sm xs>
      <h2 style={{padding:"15px 0",textAlign:"center"}}><b style={{color:"grey"}}>RATING :
      </b>{this.props.webDoc.intensity}</h2>
      </Visible>
      <p style={{color:"grey"}}>
      <b>Link : </b>
      <ScreenClassRender style={styleFunction}>
      <a href={this.props.webDoc.url} target="_blank">
      {this.props.webDoc.url}
      </a>
      </ScreenClassRender>
      </p>
      </CardText>
      </Card>
      </Col>
      <Visible lg xl md>
      <Col lg={2} xl={2} md={2} 
      style={{paddingLeft:0,paddingBottom:15,backgroundColor:"#dadada",borderRadius:10}}>
      <h1 style={{padding:"15px 0"}}><b style={{color:"grey"}}>RATING
      </b><br/>{this.props.webDoc.intensity}</h1>
      </Col>
      </Visible>
      </Row>
      </Paper>
      )
  }
}
DocResultCard.propTypes = {
  webDoc: React.PropTypes.object
}
