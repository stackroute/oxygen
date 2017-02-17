import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import {Container, Col, Row, Visible} from 'react-grid-system';


const styles = {
  customWidth: {
    width: 400,
  },

  textWidth: {
    width: 375,
  }
}
export default class ObjectCard extends React.Component {

render() {
  return (

<Card style={{
    marginRight: 10
}}>
<CardHeader
  title="Object"
  titleStyle={{fontSize:20, marginLeft:'50%'}}/>
<CardActions>
<DropDownMenu
  onChange={this.handleChange}
  style={styles.customWidth}
  autoWidth={false}
>
<MenuItem value={1} primaryText="Intent" />
<MenuItem value={2} primaryText="Concept" />
</DropDownMenu>

    <TextField floatingLabelText="Name" style={styles.textWidth}/>
    <br/>
      <TextField floatingLabelText="key" style={{
          width: '40%',
          float:'left',
          overflow:'hidden'
      }}/>

      <TextField floatingLabelText="value" style={{
          width: '40%',
      }}/>
    <ContentRemove style={{marginLeft: 28}}/>
    <FloatingActionButton mini={true} style={{
        marginLeft: 345
    }}>
        <ContentAdd/>
    </FloatingActionButton>
    <br/>
    <br/>
    <Divider/>

    <Row style={{
        marginLeft: '50%'
    }}>
        <FlatButton label="Edit"  />
        <FlatButton label="Delete" />
    </Row>
  </CardActions>
</Card>
);
}}
