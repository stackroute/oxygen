import React from 'react';
import Show from './JobShow.jsx';
import Request from 'superagent';
import AddJobDialog from './AddJobDialog.jsx';
import {Container} from 'react-grid-system';
const fonts={
	margin: "0px auto",
	textAlign: "center",
	fontFamily: "sans-serif",
	color: "#1976d2 "
}
export default class Job extends React.Component {
	constructor(props) {
		super(props);
		this.enableButton = this.enableButton.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.state = {jobList: [],canSubmit:false, errmsg: ""};
	}

	addJob(job)
	{
		console.log("in adding module")
		let url =`/docsearchjob/job`;
		Request
		.post(url)
		.send(job)
		.end((err, res) => {
			if(err) {				
				this.setState({errmsg: res.body, jobList: []});
				console.log(err)
			}
			let jobList1=this.state.jobList;
			jobList1.push(JSON.parse(res.text));
			this.setState({jobList:jobList1});
			//console.log("Response for posting new job : ", this.state.jobList);
		});
	}
	deletejob(id)
	{
		console.log("in delete module");
		let invert=this.state.jobList;
		let deleteItem=invert.filter(function(ele) {
			return ele._id!==id;
		});		
		this.setState({jobList:deleteItem});
		console.log("deleting job with id "+ id);
		let url =`/docsearchjob/delete`;
		Request
		.del(url)
		.send({'_id':id})
		.end(function(err, res){
			if(err)
				{console.log("error deleting "+err)}
			else
				{console.log("deleted "+res)}
		});
	}

	show()
	{
		let url =`/docsearchjob/show`;
		
		Request
		.get(url)
		.end((err, res) => {
			if(err) {
				//res.send(err);
				this.setState({errmsg: res.body});
			}
			else {
				//console.log("Response on show: ", JSON.parse(res.text));
				this.setState({jobList:JSON.parse(res.text)})
			}
		});
	}

	componentDidMount()
	{
		this.show();
	}

	update(id,newJob)
	{
		console.log("in update module");
		let invert=this.state.jobList;
		console.log(newJob)
		if(typeof newJob!=="undefined")
		{
			newJob._id=id;
			let updateItem=invert.filter(function(ele) {
				if(ele._id===id)
				{
					ele.query=newJob.query;
					ele.engineID=newJob.engineID;
					ele.exactTerms=newJob.exactTerms;
					ele.results=newJob.results;
					ele.siteSearch=newJob.siteSearch;
					return ele;
				}
				return ele;
			});		
			this.setState({jobList:updateItem});
			console.log("updating job with id "+ id);
			let url =`/docsearchjob/update`;
			Request
			.post(url)
			.send(newJob)
			.end(function(err, res){
				if(err)
					{console.log("error updating "+err)}
				else
					{console.log("updated "+res)}
			});
		}
	}
	render() {
		console.log("from main job component")
		return (
			<div style={fonts}>
			<h4>{this.state.errmsg}</h4>
			<h1 >JOB MANAGER</h1>
			{this.state.jobList.length!==0?<div>
				<h1>JOB LIST</h1>

				<Container>
				{this.state.jobList.map((item,i) =>{
					console.log("each job item")
					console.log(item)
					return (<Show index={i} key={i} indexs={i} ref="show"
						update={this.update.bind(this)}
						deletejob={this.deletejob.bind(this)} item={item} />)
				})}
				</Container>
				</div>:<h1>NO JOBS AVAILABLE</h1>}
				<AddJobDialog addJob={this.addJob.bind(this)} style={{color: "#1976d2 "}}/>
				</div>

				);
	}
	enableButton() {
		this.setState(()=>({
			canSubmit: true
		}));
	}
	disableButton() {
		this.setState(()=>({
			canSubmit: false
		}));
	}

}