import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';

const styles = {
 checkbox: {
  marginBottom: 16,
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
    this.state={
      intents:["sample1","sample2","3","4","5","6","sample1","sample2","3","4","5","6","sample2","3","4","5","6","sample1","sample2","3","4","5","6","sample2","3","4","5","6","sample1","sample2","3","4","5","6"]
    }
  }
  render()
  {
    return(
      <div >      
      <Paper  style={styles.paper} zDepth={2} rounded={false}>
      <h2 style={{color:"grey"}}>INTENTS</h2>      
      <div style={{overflowY:"scroll",height:"630px"}}>
      {
        this.state.intents.map((intent,i)=>{
          return <Checkbox
          key={i}
          label={intent}
          labelPosition="left"
          style={styles.checkbox}
          />
        })
      }    
      </div>
      </Paper>
      </div>
      )
  }
}
