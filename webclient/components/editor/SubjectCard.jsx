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
        width: 300
    }
};
export default class SubjectCard extends React.Component {
    constructor(props) {
        super(props);
        //this.enableButton = this.enableButton.bind(this);
        this.state = {
            subjectCard: {},
            subjectCardJsx: false,
            value: 3,
            attrObj: null
        };
    }
    handleChange = (event, index, value) => this.setState({value});
    componentWillReceiveProps(nextProps) {
        this.setState({subjectCardJsx: nextProps.subjectCardJsx});
        let subjectCard = {};
        if (this.state.subjectCardJsx) {
            subjectCard['name'] = nextProps.subjectCard['name'],
            subjectCard['type'] = nextProps.subjectCard['type'],
            subjectCard['attributes'] = nextProps.subjectCard['attributes'];
            var listAttr = [];
            for (let key in subjectCard['attributes']) {
                let keyValue = key;
                let value = subjectCard['attributes'][key];
                listAttr.push({
                  key: keyValue,
                  value: value
                 });
            }
            this.setState({attrObj: listAttr});
        } else {
            subjectCard['name'] = '',
            subjectCard['type'] = '';
            console.log(subjectCard['attributes']);
        }
        this.setState({subjectCard: subjectCard});
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
                    <CardHeader title='Subject' titleStyle={{
                        fontSize: 20,
                        marginLeft: '50%'
                    }}/>
                    <CardActions>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.customWidth} autoWidth={false}>
                            <MenuItem value={0} primaryText='Select Type'/>
                            <MenuItem value={1} primaryText='Intent'/>
                            <MenuItem value={2} primaryText='Concept'/>
                            <MenuItem value={3} primaryText={this.state.subjectCard['type']}/>
                        </DropDownMenu>
                        <TextField floatingLabelText='Name' value={this.state.subjectCard['name']} style={{
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

                        <TextField floatingLabelText='Type' value={this.state.subjectCard['type']} style={{
                            fullWidth: 'true'
                        }}/>
                        <TextField floatingLabelText='Name' value={this.state.subjectCard['name']} style={{
                            fullWidth: 'true'
                        }}/>
                        <br/>
                        {keyValueDisplay}
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
