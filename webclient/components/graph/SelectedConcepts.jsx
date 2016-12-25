import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import {blue300, indigo900} from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: 4,
    color:"white",
    fontWeight:600,

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
  },
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

    let splitWords=chipData.split(" ");
    let avatarText=""
    splitWords.forEach(function(word){
      avatarText+=word.charAt(0).toUpperCase();
    })
    return <Chip
    key={chipData}
    backgroundColor="#eaeaea"
    onRequestDelete={()=>this.handleRequestDelete(chipData)}
    style={styles.chip}
    >
    <Avatar size={32} color="white" backgroundColor="#1976d2">
    {avatarText}
    </Avatar>
    {chipData}
    </Chip>
  }
  render() {
    return (
      <div style={styles.wrapper}>
      {this.props.conceptChips.map(this.renderChip,this)}      
      </div>
      );
  }
}