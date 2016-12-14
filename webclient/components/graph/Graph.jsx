
import React from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
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
      <Link to="/dashboard">
      <FlatButton label="Go Back to dashboard" style={{fontSize:"50px",marginTop:"4px"}}/>
      </Link>
      <h1>Here will be displayed the graph for the seleted domain</h1>
      </div>
      );
  }
}

