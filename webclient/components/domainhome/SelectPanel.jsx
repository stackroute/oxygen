import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import SelectField from 'material-ui/SelectField';

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


  render() {
    let nest = this.props.intents.map((intent, i)=>{
          return (<Checkbox
                    key={i}
                    label={intent}
                    value={intent}
                    onCheck={this.props.getCheckedIntent}
                    labelPosition='left'
                    style={styles.checkbox}
                  />);
        })
    return(
      <div style={{textAlign: 'left', paddingLeft: 25}}>
        <List>
            <ListItem 
              primaryText="Select Intent"
              initiallyOpen={false}
              primaryTogglesNestedList={true}

              nestedItems={[
                nest
              ]}
            />
        </List>

      </div>
      );
  }
}

SelectPanel.propTypes = {
  getCheckedIntent: React.PropTypes.func,
  intents: React.PropTypes.arrayOf(React.PropTypes.string)
};
