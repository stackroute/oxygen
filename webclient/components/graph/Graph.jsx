
import React from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import AutoCompleteSearchBox from './AutoCompleteSearchBox';
import SelectPanel from './SelectPanel';
import {Container, Row, Col} from 'react-grid-system';
const fonts={
  margin: "0px auto",
  textAlign: "center",
  fontFamily: "sans-serif",
  color: "#1976d2"
}
export default class Graph extends React.Component {
  constructor(props) {
    super(props)
  }
  render()
  {
    return(
      <div style={fonts}>

      <Row>
      <Col sm={2}>
      <SelectPanel/>
      </Col>
      <Col sm={10}>
      <AutoCompleteSearchBox />
      <Row>
      <Col lg={12}>      
      <Link to="/dashboard">
      <FlatButton label="Go Back to dashboard" style={{fontSize:"50px",marginTop:"4px"}}/>
      </Link>
      </Col>
      </Row>
      </Col>
      </Row>

      
      </div>
      );
  }
}

