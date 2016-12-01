import React from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Container, Row, Col} from 'react-grid-system';
import Chip from 'material-ui/Chip';
const fonts={
  margin: "0px auto",
  textAlign: "center",
  fontFamily: "sans-serif",
  color: "#1976d2",
}
const jobcard={
  fontSize: "20px",
  fontWeight: "bold",
  textAlign:"left",
}
const card={
  width:700,
  marginTop:50
};
const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};
export default class CardResult extends React.Component {
  constructor(props) {
    super(props);
    this.state=({cardDetails:this.props.searchItem});
  }
  render() {
    return (
      <Container>
      <Row>
      <Col lg={12}>
      <Card style={card}>
      <CardHeader style={jobcard} titleStyle={{"fontSize":"16pt"}} subtitleStyle={{"fontSize":"14pt","marginTop":30}}
      title={this.state.cardDetails.title}
      />
      <CardText style={{textAlign: "left"}}>
      <p style={{color:"gray"}}><b>Description : </b>{this.state.cardDetails.description}</p>
      <p style={{color:"gray"}}><b>Link : </b><a href={this.state.cardDetails.url} target="_blank">{this.state.cardDetails.url}</a></p>
      </CardText>
      <div style={styles.wrapper}>
      <Chip style={styles.chip}>Basic:{this.state.cardDetails.intent[0].basic}</Chip>
      <Chip style={styles.chip}>Tutorial:{this.state.cardDetails.intent[0].tutorial}</Chip>
      <Chip style={styles.chip}>Manual:{this.state.cardDetails.intent[0].manual}</Chip>
      <Chip style={styles.chip}>Theory:{this.state.cardDetails.intent[0].theory}</Chip>
      <Chip style={styles.chip}>CompleteReference:{this.state.cardDetails.intent[0].completeReference}</Chip>
      </div>
      </Card>
      </Col>
      </Row>
    </Container>
      );
  }
}
