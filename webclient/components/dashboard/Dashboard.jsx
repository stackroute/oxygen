import React from 'react';
import DomainShow from './DashboardDomains.jsx';
import Request from 'superagent';
import AddDomain from './AddDomain.jsx';
import {Container,Col,Row} from 'react-grid-system';
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
		this.state = {domainList: [],canSubmit:false,errmsg:''};
				 //this.addDomain = this.addDomain.bind(this);
			   //this.colour = this.colour.bind(this);
			}

			addDomain(domain)
			{
				console.log("in adding module "+domain.name);
				console.log('length before call '+this.state.domainList.length);
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
		let response=JSON.parse(res.text);
		domainList1.push(response);
		console.log("Response for posting new job : ", response);
		this.setState({domainList:domainList1});

	});

			}

			show()
			{
				let url =`/domain/`;

				Request
				.get(url)
				.end((err, res) => {
					if(err) {
				//res.send(err);
				this.setState({errmsg: res.body});
			}
			else {
				//console.log("Response on show: ", JSON.parse(res.text));
				//let domainList1=this.state.domainList;
				let response=JSON.parse(res.text);
				this.setState({domainList:response});
			}
		});
			}

			componentDidMount()
			{
				this.show();
			}


			render() {

				return (
					<div style={fonts}>
					<h1 >Our Domains</h1>
					{this.state.domainList.length!==0?<div>

						<Container>
						{this.state.domainList.map((item,i) =>{
							return (<Col lg={4} md={4} key={i}>
								<DomainShow index={i} key={i} indexs={i} ref="show" item={item}/>
								</Col>);
						})}
						</Container>
						</div>:<h1>NO DOMAINS AVAILABLE</h1>}
						<AddDomain addDomain={this.addDomain.bind(this)} style={{color: "#1976d2 "}}/>
						</div>

						);
			}

		}
