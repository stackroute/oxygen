
import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import ActionSearch from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

const style = {
  maxHeight: 80,
  maxWidth: 750,
  marginLeft:"auto",
  marginRight:"auto",
  marginTop: 5,
  align:"center",
  textAlign: 'center'
};



export default class AutoCompleteSearchBox extends React.Component {
  constructor(props) {
    super(props)

  }
  
  render()
  {
    return(
      <div style={{align:"center"}}>
      <Paper style={style} zDepth={2} rounded={false}>
      <AutoComplete
      floatingLabelText="Search"
      filter={AutoComplete.fuzzyFilter}
      dataSource={this.props.concepts}
      style={{width:"-10px"}}
      onNewRequest={this.props.getConcept}
      textFieldStyle={{width:"680px"}}
      listStyle={{width:"680px"}}
      maxSearchResults={5}
      />
      <IconButton onClick={this.props.searchDocument}><ActionSearch /></IconButton>
      </Paper>
      </div>
      )
  }
}
AutoCompleteSearchBox.propTypes = {
  searchDocument: React.PropTypes.func,
  getConcept: React.PropTypes.func,
  concepts: React.PropTypes.arrayOf(React.PropTypes.string)
}