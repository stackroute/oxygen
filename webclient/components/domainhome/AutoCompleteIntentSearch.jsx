import React from 'react';
import VoiceSearch from './VoiceSearch';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import {Row, Col} from 'react-grid-system';
import ActionSearch from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
const style = {
  maxHeight: 80,
  maxWidth: 750,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 5,
  align: 'center',
  textAlign: 'center'
};
const iconSize = {
  width: 40,
  height: 40,
  paddingTop: 10
};

const styles = {
 checkbox: {
  marginBottom: 16
},
paper: {
  marginTop: '-20px',
  minWidth: 150,
 // backgroundColor:'#eaeaea',
 textAlign: 'left',
 padding: '20 0 5px '
}
};

export default class AutoCompleteIntentSearch extends React.Component {
  constructor(props) {
    super(props)
    this.filterFunc=this.filterFunc.bind(this);
    this.state={
      searchText:''
  }
}

filterFunc(searchText,key) {
    let sepDoc=key.split(" (")
    // if(searchText.length>=3 && searchText!==''){
    if(searchText!==''){
      return (sepDoc[0].toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    }
    return false;
  }
  handleUpdateInput(intents) {
    this.setState({
      searchText: intents
    })
  }
  handleVoiceUpdateInput(intents) {
    console.log(intents);
    this.setState({
      searchText: intents
    });
    this.props.voiceIntentInput(intents);
    this.props.searchDocument();
  }
  getIntent(intents){
    this.setState({
      searchText: ''
    })
    this.props.getIntent(intents);
  }
  render() {
    let nest = this.props.intents.map((intents, i)=>{
          return (<Checkbox
                    key={i}
                    label={intents}
                    value={intents}
                    onCheck={this.props.getIntent}
                    labelPosition='left'
                    style={styles.checkbox}
                  />);
        })
    return(
      <div style={{textAlign: 'left', paddingLeft: 25}}>
      <Paper style={style} zDepth={3} rounded={false}>
        <Row style={{padding:"0 20px"}}>
            <Col xs={9} sm={9} md={9} lg={9} xl={9} style={{paddingTop:10}}>
              <AutoComplete
                hintText="Search Intents"
                filter={this.filterFunc}
                dataSource={this.props.intents}
                fullWidth={true}
                searchText={this.state.searchText}
                onUpdateInput={this.handleUpdateInput.bind(this)}
                onNewRequest={this.getIntent.bind(this)}
                maxSearchResults={5}
                />
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1} style={{marginTop: 10, marginLeft: -60}}>
              <VoiceSearch handleUpdateInput={this.handleVoiceUpdateInput.bind(this)} />
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2} style={{marginBottom: 25}}>
                 <IconButton iconStyle={iconSize} onClick={this.props.searchDocument}>
                       <ActionSearch />
                  </IconButton>
            </Col>
        </Row>
      </Paper>
      </div>
      );
  }
}

AutoCompleteIntentSearch.propTypes = {
  getIntent: React.PropTypes.func,
  intents: React.PropTypes.arrayOf(React.PropTypes.string)
};
