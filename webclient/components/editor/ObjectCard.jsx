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
    customWidth: {
        width: 300
    }
};
export default class ObjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objectCard: {},
            objectCardJsx: false,
            value: 3,
            attrObj: null,
            style: {
              marginLeft: 10,
              marginRight: 10,
              opacity: 0.2
            }
        };
    }
    handleChange = (event, index, value) => this.setState({value:3});
    componentWillReceiveProps(nextProps) {
        this.setState({objectCardJsx: nextProps.objectCardJsx});
        let objectCard = {};
        let style = {
          marginLeft: 10,
          marginRight: 10,
          opacity: 1
        };
        if (nextProps.objectCardJsx) {
            objectCard['name'] = nextProps.objectCard['name'],
            objectCard['type'] = nextProps.objectCard['type'],
            objectCard['attributes'] = nextProps.objectCard['attributes'];

            this.setState({style: style})

            var listAttr = [];
            for (let key in objectCard['attributes']) {
                let keyValue = key;
                let value = objectCard['attributes'][key];
                listAttr.push({
                  key: keyValue,
                  value: value
                 });
            }
            this.setState({attrObj: listAttr});
        } else {
            objectCard['name'] = '',
            objectCard['type'] = '';
        }
        this.setState({objectCard: objectCard});
        console.log('yogee'+this.state.objectCard['name']);
    }
    render() {
      let keyValueDisplay = '';
        if (this.state.attrObj !== null) {
            keyValueDisplay = this.state.attrObj.slice(0,5).map( (row, index) => (
              <div>
                <TextField floatingLabelText='key' value={row.key} style={{
                    marginLeft: 10,
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
                <Card style={this.state.style}>
                    <CardHeader title='Object' titleStyle={{
                        fontSize: 20,
                        marginLeft: '50%'
                    }}/>
                    <CardActions>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.customWidth}>
                          <MenuItem value={0} primaryText="Select Type"/>
                            <MenuItem value={1} primaryText="Intent"/>
                            <MenuItem value={2} primaryText="Concept"/>
                            <MenuItem value={3} primaryText={this.state.objectCard['type']}/>
                        </DropDownMenu>
                        <br/>

                        <TextField floatingLabelText='Type' value={this.state.objectCard['type']} style={{
                              fullWidth: 'true'
                          }}/>
                        <TextField floatingLabelText='Name' value={this.state.objectCard['name']} style={{
                            fullWidth: 'true'
                        }}/>
                        <br/>
                        {keyValueDisplay}
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
                        <Row >
                            <FlatButton label='Delete' style={{
                                float: 'right'
                            }}/>
                            <FlatButton label='Edit' style={{
                                float: 'right'
                            }}/>
                        </Row>
                    </CardActions>
                </Card>
            </Col>
        );
    }
}
