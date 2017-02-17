import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

/**
 * Horizontal steppers are ideal when the contents of one step depend on an earlier step.
 * Avoid using long step names in horizontal steppers.
 *
 * Linear steppers require users to complete one step in order to move on to the next.
 */
export default class HorizontalLinearStepper extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props.stepNumber);
    this.state = {
      finished: false,
      stepIndex: this.props.stepNumber,
    }
  }

  componentWillReceiveProps(props){
    this.setState({
      stepIndex: props.stepNumber
    });
  }



  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>

        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel> Select a Subject</StepLabel>
          </Step>
          <Step>
            <StepLabel> Select an Object</StepLabel>
          </Step>
          <Step>
            <StepLabel> Select a Predicate</StepLabel>
          </Step>
        </Stepper>


       </div>
    );
  }
}
