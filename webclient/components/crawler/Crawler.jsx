import React from 'react';
import TextField from 'material-ui/TextField';
import Request from 'superagent';
import RaisedButton from 'material-ui/RaisedButton';


export default class Crawler extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			url:'',
			term:''

		}
		this.handleUrl = this.handleUrl.bind(this);
		this.handleTerm = this.handleTerm.bind(this);
		this.submitCrawl = this.submitCrawl.bind(this);
	}

	handleUrl(event) {
		this.setState({url: event.target.value});
	}
	handleTerm(event) {
		this.setState({term: event.target.value});
	}

	submitCrawl() {
		let crawlObj = {
        crawlUrl: this.state.url,
        crawlTerm: this.state.term,
      };

		let url =`/crawl/` +this.state.url+ `/` + this.state.term;

		Request
		.post(url)
        .send(crawlObj)
		.end((err, res) => {
			if(err) {
    //res.send(err);
}

else {
	console.log('Response on show in child: ', JSON.parse(res.text));
    //let domainList1=this.state.domainList;
    let response=JSON.parse(res.text);
    
}
});
	}
	render(){

		return (
			<div style={{textAlign: 'left', paddingLeft: 100}}>
			<div>
			<TextField
			hintText="Enter url"
			floatingLabelText="Url of document to be crawled"
			value = {this.state.url}
			onChange = {this.handleUrl}
			/>
			</div>
			<div>
			<TextField
			hintText="Enter term"
			floatingLabelText="Enter term to be crawled"
			value = {this.state.term}
			onChange = {this.handleTerm}
			/>
			</div>
			<div>
			<RaisedButton label="submit" primary={true} onClick={this.submitCrawl}/>
			</div>
			</div>

			)
	}
}
