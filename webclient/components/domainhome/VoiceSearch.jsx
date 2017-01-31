import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionVoice from 'material-ui/svg-icons/action/settings-voice';

export default class VoiceSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: ''
		}
		this.startDictation = this.startDictation.bind(this);
		// this.handleChange = this.handleChange.bind(this);
	}
	startDictation() {
 
 		var th = this;
        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            var recognition = new webkitSpeechRecognition();
 
            recognition.continuous = false;
            recognition.interimResults = false;
 
            recognition.lang = "en-US";
            recognition.start();
 
            recognition.onresult = function(e) {
                // th.setState({search: e.results[0][0].transcript});
                th.props.handleUpdateInput(e.results[0][0].transcript);
                recognition.stop();
                console.log(e.results[0][0].transcript);
                // document.getElementById('labnol').submit();
            };

            recognition.onerror = function(e) {
                recognition.stop();
            }
        }
    }
    // handleChange(event) {
    // 	this.setState({search: event.target.value});
    // }
	render() {
		return (
			<div>
	            <IconButton onClick={this.startDictation}>
	            	<ActionVoice />
	            </IconButton>
	        </div>
		);
	}
}
VoiceSearch.propTypes = {
  handleUpdateInput: React.PropTypes.func,
};