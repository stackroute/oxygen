import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
const jobcard={
  padding: 0,
  fontWeight: "bold",
  textAlign:"center"
}
const layout={
  maxWidth:1200,
  width:"auto",
  marginLeft:"auto",
  borderRadius:7,
  marginRight:"auto",
  marginTop:5
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
        return (<Paper key={i} zDepth={4} style={layout} rounded={false}>
          <Card style={layout}>
          <CardHeader style={jobcard}
          textStyle={{padding:0}}
          titleStyle={{"fontSize":"18pt",padding:"16px 16px 0"}}
          title="THIS IS A SAMPLE CARD FOR WEBDOCUMENT RESULTS"
          />
          <CardText style={{textAlign: "left",padding:"0px 16px"}}>
          <p style={{color:"gray"}}><b>Description : 
          </b>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          Aenean commodo ligula eget dolor. Aenean massa.
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Lorem ipsum dolor sit amet, consectetu
          er adipiscing elit. Aenean commodo ligula eget dolor.
          Aenean massa. Cum sociis natoque penatibus 
          et magnis dis parturient montes, nascetur ridiculus mus.
          Donec quam felis, ultricies nec, pellente
          sque eu, pretium quis, sem. Nulla consequat massa quis enim. 
          Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
          arcu. In enim justo, rhoncus ut, imperdiet a,
          venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.
          </p>
          <p style={{color:"gray"}}>
          <b>Link : </b>
          <a href={"#"} target="_blank">
          www.wwww.wwww.www.wwww.www.ww
          </a></p>
          </CardText>
          <div style={styles.wrapper}>
          <Chip style={styles.chip}>Basic:</Chip>
          <Chip style={styles.chip}>Tutorial:</Chip>
          <Chip style={styles.chip}>Example:</Chip>
          <Chip style={styles.chip}>Manual:</Chip>
          <Chip style={styles.chip}>CompleteReference:</Chip>
          </div>
          </Card>
          </Paper>)
      })
    }
    </div>

    );
  }
}
DocResultCard.propTypes = {
  webDocs: React.PropTypes.arrayOf(React.PropTypes.object)
}
