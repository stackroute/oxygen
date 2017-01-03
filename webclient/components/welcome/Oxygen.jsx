
import React from 'react';
import {Link} from 'react-router';
import {ScreenClassRender} from 'react-grid-system';

const imgStyle = (screenClass) => {
  if (screenClass === 'xl') {return { width: '700px', height:'auto' };}
  if (screenClass === 'lg') {return { width: '600px', height:'auto' };}
  if (screenClass === 'md') {return { width: '600px', height:'auto' };}
  if (screenClass === 'sm') {return { width: '600px', height:'auto'};}
  return { width: '300px', height: 'auto'};
};
const divStyle = (screenClass) => {
  if (screenClass === 'xl') {return { width: '700px',margin:"8% auto auto" };}
  if (screenClass === 'lg') {return { width: '600px',margin:"8% auto auto"};}
  if (screenClass === 'md') {return { width: '600px',margin:"8% auto auto" };}
  if (screenClass === 'sm') {return { width: '600px',margin:"8% auto auto" };}
  return { width: '300px',margin:"40% auto auto"};

};

export default class Oxygen extends React.Component {
  constructor(props) {
    super(props);
  }
  render()
  {
    return(
     <ScreenClassRender style={divStyle}>
     <div>
     <Link to= '/welcome' style={{ outline: 0, border: 'none'}}>
     <ScreenClassRender style={imgStyle}>
     <img src='./../assets/images/oxygen.jpg' />
     </ScreenClassRender>
     </Link>
     </div>
     </ScreenClassRender >
     );
  }
}
