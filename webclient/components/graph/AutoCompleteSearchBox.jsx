import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import ActionSearch from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {Row, Col} from 'react-grid-system';
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


export default class AutoCompleteSearchBox extends React.Component {
  constructor(props) {

    super(props)
    this.filterFunc=this.filterFunc.bind(this);
    this.state={
      searchText:''
    }
  }
  filterFunc(searchText,key)
  {
    let sepDoc=key.split(" (")
    if(searchText.length>=3 && searchText!==''){
      return (sepDoc[0].toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    }
    return false;
  }
  handleUpdateInput(concept)
  {
    this.setState({
      searchText: concept
    })
  }
  getConcept(concept){
    this.setState({
      searchText: ''
    })
    this.props.getConcept(concept);
  }

  render()
  {
    return(
      <div style={{align: 'center'}}>
      <Paper style={style} zDepth={2} rounded={false}>

      <Row style={{padding:"0 20px"}}>
      <Col xs={10} sm={10} md={10} lg={10} xl={10} style={{paddingTop:10}}>

      <AutoComplete
      hintText="What do you want to search..??"
      filter={this.filterFunc}
      dataSource={this.props.concepts}
      fullWidth={true}
      searchText={this.state.searchText}
      onUpdateInput={this.handleUpdateInput.bind(this)}
      onNewRequest={this.getConcept.bind(this)}
      maxSearchResults={5}
      />
      </Col>
      <Col xs={2} sm={2} md={2} lg={2} xl={2}>
      <IconButton iconStyle={iconSize} onClick={this.props.searchDocument}>
      <ActionSearch /></IconButton>
      </Col>
      </Row>
      </Paper>
      </div>
      );
  }
}
AutoCompleteSearchBox.propTypes = {
  searchDocument: React.PropTypes.func,
  getConcept: React.PropTypes.func,
  concepts: React.PropTypes.arrayOf(React.PropTypes.string)
};
