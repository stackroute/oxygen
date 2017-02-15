import React from 'react';
import VoiceSearch from './VoiceSearch';
import AutoComplete from 'material-ui/AutoComplete';
import ActionSearch from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {Row, Col} from 'react-grid-system';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
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
}


export default class AutoCompleteConceptSearch extends React.Component {
  constructor(props) {
    super(props)
    this.filterFunc=this.filterFunc.bind(this);
    this.state={
      searchText:''
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({searchText: nextProps.searchText});
  }

  filterFunc(searchText,key) {
    let sepDoc=key.split(" (")
    if(searchText!==''){
      return (sepDoc[0].toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    }
    return false;
  }
  handleUpdateInput(concept) {
    this.setState({
      searchText: concept
    });
  }
  handleVoiceUpdateInput(concept) {
    concept = concept.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    console.log(concept);
    this.setState({
      searchText: concept
    });
    this.props.voiceConceptInput(concept);
    this.props.searchDocument();
  }
  getConcept(concept){
    this.setState({
      searchText: ''
    })
    this.props.getConcept(concept);
  }
  showDocs() {
    console.log(this.props.searchDocument);
    console.log("hhhh");
    this.props.searchDocument;
  }

  render() {
    return(
      <div>
        <div style={{align: 'center'}}>
          <Paper style={style} zDepth={3} rounded={false}>
            <Row style={{padding:"0 20px"}}>
              <Col xs={9} sm={9} md={9} lg={9} xl={9} style={{paddingTop:10}} >
                <AutoComplete
                hintText="Search Concepts"
                filter={this.filterFunc}
                dataSource={this.props.concepts}
                fullWidth={true}
                searchText={this.state.searchText}
                onUpdateInput={this.handleUpdateInput.bind(this)}
                onNewRequest={this.getConcept.bind(this)}
                maxSearchResults={5}
                />
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} xl={1} style={{marginTop: 10, marginLeft: -60}}>
                <VoiceSearch handleUpdateInput={this.handleVoiceUpdateInput.bind(this)} />
              </Col>
              <Col xs={2} sm={2} md={2} lg={2} xl={2} style={{marginBottom: 25}} >
                <IconButton iconStyle={iconSize} onClick={this.props.searchDocument}>
                  <ActionSearch />
                </IconButton>
              </Col>
            </Row>
          </Paper>
        </div>
      </div>
    );
  }
}
AutoCompleteConceptSearch.propTypes = {
  searchDocument: React.PropTypes.func,
  getConcept: React.PropTypes.func,
  concepts: React.PropTypes.arrayOf(React.PropTypes.string)
};
