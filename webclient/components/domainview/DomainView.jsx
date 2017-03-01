import React from 'react';
import DomainMindMapGraph from './DomainMindMapGraph';
import DomainTable from './DomainTable';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';

export default class DomainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDomain: this.props.params.domainName,
            contentDisplay: 'treeGraphView',
            buttonLabel: 'View List'
        };
    }

    changeContentDisplay = () => {
        // d3.select('.domainView').remove();
        if (this.state.contentDisplay === 'treeGraphView') {
            this.setState({contentDisplay: 'listView', buttonLabel: 'View Graph'});
        } else {
            this.setState({contentDisplay: 'treeGraphView', buttonLabel: 'View List'});
        }
    }

    render() {
        let displayView = '';
        if (this.state.contentDisplay === 'treeGraphView') {
            displayView = <DomainMindMapGraph domainName={this.state.selectedDomain}/>;
        } else {
            displayView = <DomainTable domainName={this.state.selectedDomain}/>;
        }

        return (
            <div>
                <FlatButton label={this.state.buttonLabel} primary={true} style={{
                    float: 'right'
                }} onTouchTap={this.changeContentDisplay.bind(this)}/>
                <FlatButton label='Browser' primary={true} containerElement= {<Link to = {'/domainhome/'+this.state.selectedDomain}/>} style={{
                    float: 'right'
                }}/>
                <FlatButton label='Edit' primary={true} containerElement= {<Link to = {'/edit/'+this.state.selectedDomain}/>} style={{
                    float: 'right'
                }}/> {displayView}
            </div>
        );
    }
}
