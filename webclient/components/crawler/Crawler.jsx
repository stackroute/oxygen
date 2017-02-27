import React from 'react';
import Request from 'superagent';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class Crawler extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			url:'',
			term:'',
			intensity: 0,
			pathWeights: []
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
	        url: this.state.url,
	        terms: this.state.term,
    	};

		let url =`/crawl/doc`;
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
			    this.setState({
			    	intensity: response.terms[0].intensity,
			    	pathWeights: response.terms[0].pathWeights
			    });
			}
		});
	}
	render(){
		const style = {
			  height: 450,
			  width: 650,
			  margin: 10,
			  textAlign: 'center',
			  display: 'inline-block',
			};
		let tags = Object.keys(this.state.pathWeights);
		let th = this;
		let weights = [];
		tags.map(function(tag, i) {
			weights.push(<TableRow key={i}>
							<TableRowColumn style={{textAlign: 'center',fontSize: 20}}>{tag}</TableRowColumn>
							<TableRowColumn style={{textAlign: 'center',fontSize: 20}}>{th.state.pathWeights[tags[i]]}</TableRowColumn>
						</TableRow>);
		})
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
				<Paper style={style} zDepth={1} rounded={false}>
					<Table>
					    <TableHeader displaySelectAll={false}>
					      <TableRow>
					        <TableHeaderColumn style={{fontSize: 25,marginLeft: 70}}>Path</TableHeaderColumn>
					        <TableHeaderColumn style={{textAlign: 'center',fontSize: 25}}>Weight</TableHeaderColumn>
					      </TableRow>
					    </TableHeader>
					    <TableBody displayRowCheckbox={false}>
							{weights}
					    </TableBody>
					</Table>
				</Paper>
			</div>
		)
	}
}
