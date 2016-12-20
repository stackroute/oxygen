import React from 'react';
import DomainShow from './DashboardDomains.jsx';
import Request from 'superagent';
import AddDomain from './AddDomain.jsx';
import {Container,Col,Row} from 'react-grid-system';
import {green300,blue300,lime800,lightGreen500} from 'material-ui/styles/colors';
const fonts={
	margin: "0px auto",
	textAlign: "center",
	fontFamily: "sans-serif",
	color: "#1976d2 "
}
export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		// this.enableButton = this.enableButton.bind(this);
		// this.disableButton = this.disableButton.bind(this);
		this.state = {domainList: [],canSubmit:false,conceptColor:'',intentColor:[]};
	}

	addDomain(domain)
	{
		console.log("in adding module "+domain.subject);
		{domain.intents.map((ele,i) =>{
			if(ele.docs===0)
			{
				let color=this.state.intentColor;
				color.push('blue300');
				this.setState({intentColor:color});
			}
			else if(ele.docs<11)
			{
				let color=this.state.intentColor;
				color.push('lime800');
				this.setState({intentColor:color});
			}
			else {
				let color=this.state.intentColor;
				color.push('lightGreen500');
				this.setState({intentColor:color});
			}
		})}
		if(domain.concepts<5)
		{
			this.setState({conceptColor:blue300});
		}
		else if(domains.concepts<15)
		{
			this.setState({conceptColor:lime800});
		}
		else {
			this.setState({conceptColor:lightGreen500});
		}
		let dList=this.state.domainList;
		dList.push(domain);
		this.setState({domainList: dList});
		console.log(this.state.domainList[0].intents[0].intent);
		//let url =`/docsearchjob/job`;
		// Request
		// .post(url)
		// .send(job)
		// .end((err, res) => {
		// 	if(err) {
		// 		this.setState({errmsg: res.body, domainList: []});
		// 		console.log(err)
		// 	}
		// 	let domainList1=this.state.domainList;
		// 	domainList1.push(JSON.parse(res.text));
		// 	this.setState({domainList:domainList1});
		// 	//console.log("Response for posting new job : ", this.state.domainList);
		// });
	}


	show()
	{
		//let url =`/docsearchjob/show`;

		// Request
		// .get(url)
		// .end((err, res) => {
		// 	if(err) {
		// 		//res.send(err);
		// 		this.setState({errmsg: res.body});
		// 	}
		// 	else {
		// 		//console.log("Response on show: ", JSON.parse(res.text));
		// 		this.setState({domainList:JSON.parse(res.text)})
		// 	}
		// });
	}

	// componentDidMount()
	// {
	// 	this.show();
	// }


	render() {
		console.log("from main job component")
		return (
			<div style={fonts}>
			<h1 >Our Domains</h1>
			{this.state.domainList.length!==0?<div>

				<Container>
				{this.state.domainList.map((item,i) =>{
					console.log("each Domain item")
					console.log(item);
					return (<Col lg={4} md={4} key={i}>
						<DomainShow index={i} key={i} indexs={i} ref="show" item={item} 
						conceptColor={this.state.conceptColor} intentColor={this.state.intentColor}/>
						</Col>);
				})}
				</Container>
				</div>:<h1>NO DOMAINS AVAILABLE</h1>}
				<AddDomain addDomain={this.addDomain.bind(this)} style={{color: "#1976d2 "}}/>
				</div>

				);
	}

}
