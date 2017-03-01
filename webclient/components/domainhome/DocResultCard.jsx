import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Row, Col, Visible, ScreenClassRender} from 'react-grid-system';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import CircularProgressbar from '../../views/CircularProgressbar';

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
  padding: 5,
  margin:"auto",
  height: 40,
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
  typeFinder(){
    let type='';
    let url = this.props.webDoc.url;
    if((url).includes('pdf')){
      console.log('It is a pdf');
      type='pdf';
    }
    else if((url).includes('images')||(url).includes('img')||(url).includes(".png")||(url).includes(".jpg")||(url).includes(".jpeg")){
      console.log('It is an image');
      type='image';
    }
    else if((url).includes('video')||(url).includes('watch?')){
      console.log('It is a video');
      type='video';
    }
    else{
      console.log('It is a text');
      type='text';
    }
    return type;
  }
  render() {
    return (
      // <Paper zDepth={4} style={layout} rounded={false}>
        <Row>
          <Col lg={12} xl={12} md={12} sm={12} xs={12} style = {{float:'center'}}>
            <Card style={{paddingBottom: 30}}>
              <CardHeader style = {jobcard}
                textStyle={{padding: 0, color: 'grey'}}
                titleStyle = {{fontSize: '18pt', padding: '16px 16px 0', color: '#378ed4'}}
                title={this.props.webDoc.title}
              />
              <CardText style={{textAlign: "left",padding:"0px 16px"}}>
                <p style={{color:"gray"}}><b>Description :
                </b>{this.props.webDoc.description}
                </p>
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
                  <p><b>Type:</b>{this.typeFinder()}</p>
                 <Col lg={2} xl={2} md={2} style={{float:'right',textAlign: "center"}}>
                <p> Confidence Level</p>
                <CircularProgressbar percentage={Math.round(this.props.webDoc.intensity,1)} />
                </Col>
                </p>

                <Row>
                {
                  this.props.webDoc.intentObj.length!==0?this.props.webDoc.intentObj.map((item,i) =>{
                    return (<Col lg={4} md={4} sm={4} xs={4} key={i}>
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
      </Row>
    // </Paper>
  );
  }
}
DocResultCard.propTypes = {
  webDoc: React.PropTypes.object
};
