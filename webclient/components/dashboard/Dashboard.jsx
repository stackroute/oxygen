import React from 'react';
import DomainShow from './DashboardDomains.jsx';
import Request from 'superagent';
import AddDomain from './AddDomain.jsx';
import {Container,Col} from 'react-grid-system';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';

const paginationStyle1 = {
	margin: 12,
	marginBottom:50,
	float:'left'
};
const paginationStyle2 = {
	margin: 12,
	marginBottom:50,
	float:'right'
};
const fonts={
	margin: "0px auto",
	textAlign: "center",
	fontFamily: "sans-serif",
	color: "#1976d2 "
}

const style = {
	refresh: {
		marginTop:'200px',
		display: 'inline-block',
		position: 'relative'
	}
};

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		// this.enableButton = this.enableButton.bind(this);
		this.state = {domainList: [],canSubmit:false,errmsg:'',loading:"loading",pageNum:1};
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
				console.log("Response on show: ", JSON.parse(res.text));
				//let domainList1=this.state.domainList;
				let response=JSON.parse(res.text);
				this.setState({domainList:response,loading:"hide"});
			}
		});
			}

			componentDidMount()
			{
				this.show();
			}
			onPageClick(e)
			{
				let page=this.state.pageNum;
				if(e.currentTarget.dataset.id==="prev")
				{
					page-=1;
					this.setState({pageNum:page});
				}
				else
				{
					page+=1;
					this.setState({pageNum:page});
				}
			}

			render() {
				let list=[];
				let prevFlag=false;
				let nextFlag=false;
				let pages=Math.ceil(this.state.domainList.length/6);
				let pageNow=this.state.pageNum;
				if(pages===pageNow)
				{
					nextFlag=true;
				}
				if(this.state.pageNum===1)
				{
					prevFlag=true;
				}
				if(pages===1 || pages===pageNow)
				{
					list=[];
					for(let i=6*(pageNow-1);i<this.state.domainList.length;i+=1)
					{
						list.push(this.state.domainList[i]);
					}
				}
				else {
					list=[];
					let foo=6*(pageNow-1);
					for(let i=foo;i<(foo+6);i+=1)
					{
						list.push(this.state.domainList[i]);
					}
				}
				return (
					<div style={fonts}>
					<h1 >Our Domains</h1>

					{this.state.loading==="loading"?<RefreshIndicator
					size={70}
					left={10}
					top={0}
					status={this.state.loading}
					style={style.refresh}
					/>:<div>
					{list.length!==0?<div>

						<Container>
						{list.map((item,i) =>{
							return (<Col lg={4} md={4} key={i}>
								<DomainShow index={i} key={i} indexs={i} ref="show" item={item}/>
								</Col>);
						})}
						</Container>
						<Container>
						<RaisedButton label="prev" disabled={prevFlag} data-id="prev"
						style={paginationStyle1} onClick={this.onPageClick.bind(this)}/>
						<RaisedButton label="next" disabled={nextFlag} data-id="next" 
						style={paginationStyle2} onClick={this.onPageClick.bind(this)}/>
						</Container>
						</div>:<h1>NO DOMAINS AVAILABLE</h1>}</div>}
						<AddDomain addDomain={this.addDomain.bind(this)} style={{color: "#1976d2 "}}/>
						</div>

						);

			}
		}
