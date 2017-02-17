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
        width: 400
    },

    textWidth: {
        width: 375
    }
}
export default class SubjectCard extends React.Component {
    constructor(props) {
        super(props);
        //this.enableButton = this.enableButton.bind(this);
        this.state = {
            subjectCard: {},
            subjectCardJsx: false,
            value: 0
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({subjectCardJsx: nextProps.subjectCardJsx});
        let subjectCard = {};
        if (this.state.subjectCardJsx) {
            subjectCard['name'] = nextProps.subjectCard['name'],
            subjectCard['type'] = nextProps.subjectCard['type']
        } else {
            subjectCard['name'] = '',
            subjectCard['type'] = '';
            subjectCard['attributes'] = {};
        }
        this.setState({
          subjectCard: subjectCard
        });
    }

    render() {
        return (
            <Card style={{
                marginLeft: 10
            }}>
                <CardHeader title="Subject" titleStyle={{
                    fontSize: 20,
                    marginLeft: '50%'
                }}/>
                <CardActions>
                    <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.customWidth} autoWidth={false}>
                        <MenuItem value={0} primaryText={this.state.subjectCard['type']}/>
                    </DropDownMenu>

                    <TextField floatingLabelText="Name" value={this.state.subjectCard['name']} style={styles.textWidth}/>
                    <br/>
                    <TextField floatingLabelText="key" value='key' style={{
                        width: '40%',
                        float: 'left',
                        overflow: 'hidden'
                    }}/>

                    <TextField floatingLabelText="value" value='value' style={{
                        width: '40%'
                    }}/>
                    <ContentRemove style={{
                        marginLeft: 28
                    }}/>
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
                        <FlatButton label="Edit"/>
                        <FlatButton label="Delete"/>
                    </Row>
                </CardActions>
            </Card>
        );
    }
}
