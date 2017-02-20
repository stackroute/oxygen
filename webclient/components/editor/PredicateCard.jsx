import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import Divider from 'material-ui/Divider';
import {Container, Col, Row, Visible} from 'react-grid-system';

const styles = {
    textWidth: {
        width: 375
    }
}
export default class PredicateCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            predicateCard: {},
            predicateCardJsx: false,
            attrObj: null
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({predicateCardJsx: nextProps.predicateCardJsx});
        let predicateCard = {};
        if (this.state.predicateCardJsx) {
            predicateCard['name'] = nextProps.predicateCard['name'];
            predicateCard['attributes'] = nextProps.predicateCard['properties'];

            var listAttr = [];
            for (let key in predicateCard['attributes']) {
                let keyValue = key;
                let value = predicateCard['attributes'][key];

                listAttr.push({
                  key: keyValue,
                  value: value
                 });
            }
            this.setState({attrObj: listAttr});
        } else {
            predicateCard['name'] = '',
            predicateCard['attributes'] = '';
        }
        this.setState({predicateCard: predicateCard});
    }
    render() {
      let keyValueDisplay = '';
        if (this.state.attrObj !== null) {
            keyValueDisplay = this.state.attrObj.slice(0,5).map( (row, index) => (
              <div>
                <TextField floatingLabelText='key' value={row.key} style={{
                    width: '40%',
                    float: 'left',
                    overflow: 'hidden'
                }}/>

              <TextField floatingLabelText='value' value={row.value} style={{
                    width: '40%'
                }}/>
              <br/>
              </div>
            ));
        }
        return (
            <Col lg={4} xl={4} md={4} sm={12} xs={12}>
                <Card style={{
                    marginLeft: 10,
                    marginRight: 10
                }}>
                    <CardHeader title="Predicate" titleStyle={{
                        fontSize: 20,
                        marginLeft: '50%'
                    }}/>
                    <CardActions>
                        <TextField floatingLabelText="Name" value={this.state.predicateCard['name']} style={{
                            fullWidth: 'true'
                        }}/>
                        <br/>
                        {keyValueDisplay}
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <Divider/>

                        <Row>
                            <FlatButton label="Edit" style={{
                                float: 'right'
                            }}/>
                        </Row>
                    </CardActions>
                </Card>
            </Col>
        );
    }
}
