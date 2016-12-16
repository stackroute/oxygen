
import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ActionDashboard from 'material-ui/svg-icons/action/dashboard';
import ActionSearch from 'material-ui/svg-icons/action/search';
import {Link} from 'react-router';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data:true,open: false}
    this.updateState = this.updateState.bind(this);
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  updateState() {
    this.setState({data:false});
  }
  render() {
    return (
      <div>

      <AppBar
      onLeftIconButtonTouchTap={this.handleToggle}
      title="Oxygen"
      iconElementRight={<span/>
      }/>
      <Drawer
      docked={false}
      width={250}
      open={this.state.open}
      onRequestChange={(open) => this.setState({open})}>

      <MenuItem onTouchTap={this.handleToggle}>
      <Link to="/job">
      <IconButton><ActionSearch /></IconButton>
      <FlatButton label="Job" style={{fontSize:"50px",marginTop:"4px"}}/>
      </Link>
      </MenuItem>

      <MenuItem onTouchTap={this.handleToggle}>
      <Link to="/dashboard">
      <IconButton><ActionDashboard/></IconButton>
      <FlatButton label="dashboard" style={{fontSize:"50px",marginTop:"4px"}}/>
      </Link>
      </MenuItem>
      </Drawer>
      <main>
      {this.props.children}
      </main>
      </div>
      );
  }
}
Welcome.propTypes = {  
  children: React.PropTypes.node.isRequired
}
export default Welcome;
