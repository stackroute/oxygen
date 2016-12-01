import React from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
const fonts={
  margin: "0px auto",
  textAlign: "center",
  fontFamily: "sans-serif",  
  color: "#1976d2"
}
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }
  render()
  {
    console.log("on Dashboard")
    return(
      <div style={fonts}>
      <Link to="/graph">
      <FlatButton label="Go to Graph" style={{fontSize:"50px",marginTop:"4px"}}/>
      </Link>
      <h1>This is your dashboard</h1>
      </div>
      );
  }
}
