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
import LoadProps from './LoadProps';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import IconButton from 'material-ui/IconButton';
import AddButton from 'material-ui/svg-icons/content/add';

const styles = {
    customWidth: {
        width: 300
    },
};
export default class SubjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectCard: {},
            subjectCardJsx: false,
            value: 3,
            attrObj: null,
            style: {
              marginLeft: 10,
              marginRight: 10,
              opacity: 0.2
            },
            propertyCount: 0,
        };
    }
    handleChange = (event, index, value) => this.setState({value: 3});

    componentWillReceiveProps(nextProps) {
        this.setState({subjectCardJsx: nextProps.subjectCardJsx});
        let subjectCard = {};
        let style = {
          marginLeft: 10,
          marginRight: 10,
          opacity: 1
        };
        if (this.state.subjectCardJsx) {
            this.setState({style: style});
            subjectCard['name'] = nextProps.subjectCard['name'],
            subjectCard['type'] = nextProps.subjectCard['type'],
            subjectCard['attributes'] = nextProps.subjectCard['attributes'];

            var listAttr = [];
            for (let key in subjectCard['attributes']) {
                let keyValue = key;
                let value = subjectCard['attributes'][key];

                listAttr.push({key: keyValue, value: value});
            }
            this.setState({attrObj: listAttr});
        } else {
            subjectCard['name'] = '',
            subjectCard['type'] = '';
        }
        this.setState({subjectCard: subjectCard});
    }

    addProperty(){
      let propertyCount = this.state.propertyCount;
      this.setState({
        propertyCount: propertyCount + 1
      });
    }

    render() {

        return (
            <Col lg={4} xl={4} md={4} sm={12} xs={12}>
              <Card>
                  <CardHeader title='Subject' titleStyle={{
                      fontSize: 20,
                      marginLeft: '50%'
                  }}/>
                  <CardText>
                    <Formsy.Form
                      onValid={this.enableButton}
                      onValidSubmit={this.submitForm}
                    >
                    <FormsySelect
                      name="subtype"
                      required
                      floatingLabelText="Select Type"
                      menuItems={this.selectFieldItems}
                      style={{
                          fullWidth: 'true'
                      }}
                    >
                      <MenuItem value={'Intent'} primaryText="Intent" />
                      <MenuItem value={'Concept'} primaryText="Concept" />
                  </FormsySelect>
                  <FormsyText
                    name="subname"
                    required
                    hintText="A Subject Name"
                    floatingLabelText="Subject Name"
                    style={{
                        fullWidth: 'true'
                    }}
                  />
                  <AddButton onTouchTap = {this.addProperty}/>
                </Formsy.Form>
                        <Divider/>
                        <Row>
                            <FlatButton label='Delete' style={{
                                float: 'right'
                            }}/>
                            <FlatButton label='Edit' style={{
                                float: 'right'
                            }}/>
                        </Row>
                    </CardText>
                </Card>
            </Col>
        );
    }
}
