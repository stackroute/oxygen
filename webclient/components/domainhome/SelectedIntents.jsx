import React from 'react';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: 4,
    color: 'white',
    fontWeight: 600
 },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 680,
    marginTop: 10,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};
export default class SelectedIntents extends React.Component {

  constructor(props) {
    super(props);
    console.log('from the concept chiplets');
    console.log(props.intentChips);
  }
  handleRequestDelete = (data) => {
    console.log('data to b deleted' + data);
    this.props.deleteIntent(data);
  }
  renderChip(chipData) {
    return( 
      <Chip
        key={chipData}
        backgroundColor= '#eaeaea'
        onRequestDelete={()=>this.handleRequestDelete(chipData)}
        style={styles.chip}
      >
        {chipData}
      </Chip>)
  }
  render() {
    return (
      <div style={styles.wrapper}>
      {this.props.intentChips.map(this.renderChip,this)}      
      </div>
    );
  }
}
SelectedIntents.propTypes = {
  deleteIntent:React.PropTypes.func,
  intentChips:React.PropTypes.arrayOf(React.PropTypes.string)
}