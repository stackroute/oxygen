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
		this.state = {domainList: [],canSubmit:false,conceptColor:'',intentColor:'',docsColor:'',errmsg:''};
				 //this.addDomain = this.addDomain.bind(this);
			   //this.colour = this.colour.bind(this);
			}

			addDomain(domain)
			{
				console.log("in adding new Domain "+domain.name);
				console.log('length before call '+this.state.domainList.length);
				let response={};
				let url =`/domain/`+domain.name;
				Request
				.post(url)
				.send(domain)
				.end((err, res) => {
					if(err) {
			//	this.setState({errmsg: res.body, domainList: []});
			console.log(err)
		}
		console.log("got response "+JSON.parse(res.text).name);
		console.log('length after call '+this.state.domainList.length);
		let domainList1=this.state.domainList;
		response=JSON.parse(res.text);
		console.log("Response for posting new domain : ", response);
		domainList1.push(response);
		this.setState({domainList:domainList1});
		console.log("Response for posting new domain : ", response);
		this.colour(response);
	});

			}

			colour(domain)
			{

				if(domain.docs===0)
				{
					this.setState({docsColor:blue300});
				}
				else if(domain.docs<11)
				{
					this.setState({docsColor:lime800});
				}
				else {
					this.setState({docsColor:lightGreen500});
				}

				if(domain.intents.length==0)
				{
					this.setState({intentColor:blue300});
				}
				else if(domain.intents.length<11)
				{
					this.setState({intentColor:lime800});
				}
				else {
					this.setState({intentColor:lightGreen500});
				}


				if(domain.concepts.length<5)
				{
					this.setState({conceptColor:blue300});
				}
				else if(domains.NoOfConcepts<15)
				{
					this.setState({conceptColor:lime800});
				}
				else {
					this.setState({conceptColor:lightGreen500});
				}
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

	//componentDidMount()
	//{
	// 	this.show();
	 //}


	 render() {

	 	return (
	 		<div style={fonts}>
	 		<h1 >Our Domains</h1>
	 		{this.state.domainList.length!==0?<div>

	 			<Container>
	 			{this.state.domainList.map((item,i) =>{
	 				return (<Col lg={4} md={4} key={i}>
	 					<DomainShow index={i} key={i} indexs={i} ref="show" item={item}
	 					conceptColor={this.state.conceptColor} intentColor={this.state.intentColor} docsColor={this.state.docsColor}/>
	 					</Col>);
	 			})}
	 			</Container>
	 			</div>:<h1>NO DOMAINS AVAILABLE</h1>}
	 			<AddDomain addDomain={this.addDomain.bind(this)} style={{color: "#1976d2 "}}/>
	 			</div>

	 			);
	 }

	}
