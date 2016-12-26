
import React from 'react';
import {Link} from 'react-router';
export default class Oxygen extends React.Component {
  constructor(props) {
    super(props)
  }
  render()
  {
    return(
      <div style={{width:"650px",margin:"auto"}}>
      <Link to="/welcome" style={{outline:0,border:"none"}}>
      <img src='./../assets/images/oxy.png' style={{width: 650, height:"auto"}} />
      </Link>
      </div>
      );
  }
}
