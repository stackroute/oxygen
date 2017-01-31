import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Row, Col, Visible, ScreenClassRender} from 'react-grid-system';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';

// <CardMedia
//       overlay={<CardTitle title="RATING" subtitle={this.props.webDoc.intensity} />} />


const styleFunction = (screenClass) => {
  if (screenClass === 'xl') {return {fontSize: 18, color: '#1976d2'};}
  if (screenClass === 'lg') {return {fontSize: 18, color: '#1976d2'};}
  if (screenClass === 'md') {return {fontSize: 18, color: '#1976d2'};}
  if (screenClass === 'sm') {return {fontSize: 18, color: '#1976d2'};}
  return {fontSize: 15, color: '#1976d2 '};
};
const jobcard = {
  padding: 0,
  fontWeight: 'bold',
  textAlign: 'left'
};


const layout={
  maxWidth:1050,
  width:"auto",
  margin:" 15px auto 0",
  backgroundColor:"#dadada",
  borderRadius:7

};
export default class DocResultCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
      <Paper zDepth={4} style={layout} rounded={false}>
      <Row>
      <Col lg={10} xl={10} md={10} sm={12} xs={12} style = {{paddingRight: 0}}>
      <Card style={{paddingBottom: 15}}>
      <CardHeader style = {jobcard}
      textStyle={{padding: 0, color: 'grey'}}
      titleStyle = {{fontSize: '18pt', padding: '16px 16px 0', color: '#378ed4'}}
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
      <p style={{color: 'grey'}}>
      <b>Link : </b>
      <ScreenClassRender style={styleFunction}>
      <a href={this.props.webDoc.url} target="_blank">
      {
        this.props.webDoc.url.length < 70 ?
        this.props.webDoc.url: 
        this.props.webDoc.url.substring(0,65)+"..."
      }
      
      </a>
      </ScreenClassRender>
      </p>
      <Row>
      {
        this.props.webDoc.intentObj.length!==0?this.props.webDoc.intentObj.map((item,i) =>{

          return (<Col lg={4} md={6} sm={6} xs={12} key={i}>
            <Chip
            style={{margin:4}}
            >
            {item.intent} : {item.count}
            </Chip>
            </Col>);
        }):
        <h3 style={{paddingLeft:15,color:"#8aa6bd",marginBottom:0}}>No Intents Linked...!!</h3>
      }
      </Row>
      </CardText>
      </Card>
      </Col>
      <Visible lg xl md>
      <Col lg={2} xl={2} md={2}
      style={{marginTop:"4%",paddingLeft:0}}>
      <h1 ><b style={{color:"grey"}}>RATING
      </b><br/>{this.props.webDoc.intensity}</h1>
      </Col>
      </Visible>
      </Row>
      </Paper>
      );
  }
}
DocResultCard.propTypes = {
  webDoc: React.PropTypes.object
};

