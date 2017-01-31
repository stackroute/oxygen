import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  customWidth: {
    width: 200,
  },
};

const rel = [
  {
    name : 'Rel1',
  },
  {
    name : 'Rel1',
  },
  {
    name : 'Rel1',
  },
  {
    name : 'Rel1',
  },
]
export default class Predicate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      relations : this.props.nodeRelations,
      value: 1
    }
  }

  handleChange = (event, index, value) => this.setState({value});

  render(){
    return null
  }
}
