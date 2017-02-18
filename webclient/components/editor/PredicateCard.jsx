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

  textWidth: {
    width: 375,
  }
}
export default class PredicateCard extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          predicateCard: {},
          predicateCardJsx: false
      };
  }

  componentWillReceiveProps(nextProps) {

      this.setState({predicateCardJsx: nextProps.predicateCardJsx});
      let predicateCard = {};
      if (this.state.predicateCardJsx) {
          predicateCard['name'] = nextProps.predicateCard['name']
      } else {
          predicateCard['name'] = '',
          predicateCard['attributes'] = {};
      }
      this.setState({predicateCard: predicateCard});
  }
render() {
  return (
    <Col lg={4} xl={4} md={4} sm={12} xs={12}>
      <Card style={{
          marginLeft: 10,
          marginRight: 10
      }}>
  <CardHeader
    title='Predicate'
    titleStyle={{fontSize:20, marginLeft:'50%'}}/>
  <CardActions>
    <TextField floatingLabelText='Name' value={this.state.predicateCard['name']} style={{
        fullWidth: 'true'
    }}/>
    <br/>
    <TextField floatingLabelText='key' style={{
        width: '40%',
        float: 'left',
        overflow: 'hidden'
    }}/>

    <TextField floatingLabelText='value' style={{
        width: '40%'
    }}/>
    <ContentRemove style={{
        float: 'right',
        marginTop: '10%'
    }}/>
    <FloatingActionButton mini={true} style={{
        float: 'right',
        overflow: 'hidden'
    }}>
        <ContentAdd/>
    </FloatingActionButton>
    <br/>
    <br/>
    <br/>
    <br/>
    <Divider/>

    <Row>
        <FlatButton label='Edit' style={{float:'right'}}/>
    </Row>
  </CardActions>
  </Card>
  </Col>
);
}
}
