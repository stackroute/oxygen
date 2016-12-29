import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
const jobcard={
  padding: 0,
  fontWeight: "bold",
  textAlign:"left"
}

const layout={
  maxWidth:1200,
  width:"auto",
  marginLeft:"auto",
  borderRadius:7,
  marginRight:"auto",
  marginTop:30
};
const styles = {
  chip: {
    margin: 4
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding:"0 10px 10px"
  }
};
export default class DocResultCard extends React.Component {
  constructor(props) {
    super(props);
    console.log("from the docresultcard page")
    console.log(props)

  }
  render() {
    return (<div>

    {
      this.props.webDocs.map(function(doc,i){
        return (
          <Row>
          <Col>
          <Paper key={i} zDepth={4} style={layout} rounded={false}>
          <Card style={layout}>
          <CardHeader style={jobcard}
          textStyle={{padding:0,color:'grey'}}
          titleStyle={{"fontSize":"18pt",padding:"16px 16px 0",color:'grey'}}
          title={doc.title}
          />
          <CardText style={{textAlign: "left",padding:"0px 16px"}}>
          <p style={{color:"gray"}}><b>Description :
          </b>{doc.description}
          </p>
          <p style={{color:"gray"}}><b>Rating :
          </b>{doc.intensity}
          </p>
          <p style={{color:"gray"}}>
          <b>Link : </b>
          <a href={doc.url} target="_blank" style={{fontSize:18,textDecoration:"none",color:"#1976d2 "}}>
          {doc.url}
          </a></p>
          </CardText>          
          </Card>
          </Paper>
          </Col>
          <Col>
          <h1>fdgoip</h1>
          </Col>
          </Row>
          
          )
      })
    }
    </div>

    );
  }
}
DocResultCard.propTypes = {
  webDocs: React.PropTypes.arrayOf(React.PropTypes.object)
}
