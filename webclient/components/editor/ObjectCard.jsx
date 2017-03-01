import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import {Container, Col, Row, Visible} from 'react-grid-system';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import LoadObjectProps from './LoadObjectProps';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import IconButton from 'material-ui/IconButton';
import AddButton from 'material-ui/svg-icons/content/add';

const styles = {
    customWidth: {
        width: 300
    },
};
export default class ObjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objectDetails: {},
            objectCardJsx: '',
            attrObj: null,
            style: {
              marginLeft: 10,
              marginRight: 10,
              opacity: 0.2
            },
            propertyCount: 0,
            title: 'Object'
        };
    }
    handleChange = (event, index, value) => this.setState({value: 3});

    componentWillReceiveProps(nextProps) {
        this.setState({objectCardJsx: nextProps.objectCardJsx});
        let objectCard = {};
        let style = {
          marginLeft: 10,
          marginRight: 10,
          opacity: 1
        };
        if(nextProps.objectCardJsx == 'new'){
            this.setState({
              style: style,
              objectCardJsx: 'new'
            });
        }
        if(nextProps.objectCardJsx == 'old'){
            this.setState({
              style: style,
              objectCardJsx: 'old',
              title: nextProps.objectCard['objtype'] + ': '+ nextProps.objectCard['objname']
            });
        }
    }

    render() {
        let newObject = '';
        if(this.state.objectCardJsx == 'new'){
          newObject = <LoadObjectProps objectDetails = {this.props.objectCard} updateObjectCard = {this.props.updateObjectCard} selectedSubject = {this.props.selectedSubject} selectedDomain={this.props.selectedDomain}/>;
        }
        if(this.state.objectCardJsx == 'old'){
          newObject = <LoadObjectProps objectDetails = {this.props.objectCard} updateObjectCard = {this.props.updateObjectCard} selectedSubject = {this.props.selectedSubject} selectedDomain={this.props.selectedDomain}/>
        }
        return (
            <Col lg={4} xl={4} md={4} sm={12} xs={12}>
              <Card style={this.state.style}>
                  <CardHeader title={this.state.title} titleStyle={{
                      fontSize: 18,
                  }}/>
                  <CardText>
                    {newObject}
                  </CardText>
                  <CardActions/>
                </Card>
            </Col>
        );
    }
}
