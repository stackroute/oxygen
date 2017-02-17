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
export default class PredicateCard extends React.Component {

render() {
  return (
<Card >
  <CardHeader
    title="Predicate"
    titleStyle={{fontSize:20, marginLeft:'50%'}}/>
  <CardActions>
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
          marginLeft: 355
      }}>
          <ContentAdd/>
      </FloatingActionButton>
      <br/>
      <br/>
      <Divider/>

      <Row style={{
          marginLeft: '75%'
      }}>
          <FlatButton label="Edit" />
      </Row>
    </CardActions>
</Card>
);
}}
