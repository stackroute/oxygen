import React from 'react';
import Checkbox from 'material-ui/Checkbox';

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

export default class SelectPanel extends React.Component {
  constructor(props) {
    super(props);
  }


  render()
  {
    return(
      <div style={{textAlign: 'left', paddingLeft: 25}}>
      <h2 style={{color: 'grey'}}>INTENTS</h2>
      {
        this.props.intents.map((intent, i)=>{
          return (<Checkbox
            key={i}
            label={intent}
            value={intent}
            onCheck={this.props.getCheckedIntent}
            labelPosition='left'
            style={styles.checkbox}
            />);
        })
      }
      </div>
      );
  }
}

SelectPanel.propTypes = {
  getCheckedIntent: React.PropTypes.func,
  intents: React.PropTypes.arrayOf(React.PropTypes.string)
};
