import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class NodeRelationEditor extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: this.props.name,
      relations: this.props.relation
    };
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render(){
    var relationList = this.state.relations.map((eachRelation,i) =>
            <div>
              <ListItem primaryText={eachRelation}/>
              <FlatButton label='Edit'/>
              <FlatButton label='Delete'/>
            </div>
           );
    return (
      <div>
      <TextField
          id='text-field-controlled'
          value={this.state.value}
          onChange={this.handleChange}
        />
      <Divider/>
      <List>
        {relationList}
      </List>
    </div>
    )
  }
}
