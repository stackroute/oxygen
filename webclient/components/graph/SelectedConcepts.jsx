import React from 'react';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: 4,
    color:"white",
    fontWeight:600

  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    width:"100%",
    maxWidth: 680,
    marginTop:10,
    marginBottom:0,
    marginLeft:"auto",
    marginRight:"auto"
  }
};



export default class SelectedConcepts extends React.Component {

  constructor(props) {
    super(props)
    
    console.log("from the concept chiplets")
    console.log(props.conceptChips)

  }
  handleRequestDelete=(data) => {
    console.log("data to b deleted "+data)
    this.props.deleteConcept(data);
  }
  renderChip(chipData)
  {

   return( <Chip
    key={chipData}
    backgroundColor="#eaeaea"
    onRequestDelete={()=>this.handleRequestDelete(chipData)}
    style={styles.chip}
    >
    {chipData}
    </Chip>)
 }
 render() {
  return (
    <div style={styles.wrapper}>
    {this.props.conceptChips.map(this.renderChip,this)}      
    </div>
    );
}
}
SelectedConcepts.propTypes = {
  deleteConcept:React.PropTypes.func,
  conceptChips:React.PropTypes.arrayOf(React.PropTypes.string)
}