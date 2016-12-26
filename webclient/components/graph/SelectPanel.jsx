import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';

const styles = {
 checkbox: {
  marginBottom: 16
},
paper:{
  marginTop:"-20px",
  backgroundColor:"#eaeaea",
  height:"731px",
  textAlign:"left",
  padding:"20px 25px 0px"


}
};

export default class SelectPanel extends React.Component {
  constructor(props) {
    super(props)
  }


  render()
  {
    return(
      <div >      
      <Paper style={styles.paper} zDepth={2} rounded={false}>
      <h2 style={{color:"grey"}}>INTENTS</h2>      
      <div style={{overflowY:"scroll",height:"630px"}}>
      {
        this.props.intents.map((intent,i)=>{
          return (<Checkbox
            key={i}
            label={intent}
            value={intent}
            onCheck={this.props.getCheckedIntent}
            labelPosition="left"
            style={styles.checkbox}
            />)
        })
      }    
      </div>
      </Paper>
      </div>
      )
  }
}
SelectPanel.propTypes = {
  getCheckedIntent: React.PropTypes.func,
  intents:React.PropTypes.arrayOf(React.PropTypes.string)
}