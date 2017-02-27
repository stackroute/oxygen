import React from 'react';
import Request from 'superagent';
import ReactFauxDOM from 'react-faux-dom';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import d3 from 'd3';

export default class SunburstView extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            chart: 'Loading...',
            data: {},
            domainName: '',
            expandable: false
        }
    }
    componentDidMount(){
        // let th = this;
        // let promise = new Promise(function (resolve, reject) {
            // resolve(th.getTreeOfDomain());
            this.getTreeOfDomain();
        // })
        // promise.then(function() {

        // })
    }

    // componentWillReceiveProps(nextProps) {
    //     let th = this;
    //     console.log(nextProps.domainName+' nextProps')
    //     if(nextProps.domainName.length >= 0) {
    //         let promise = new Promise(function (resolve, reject) {
    //             resolve(th.getTreeOfDomain());
    //             // this.getTreeOfDomain();
    //         })
    //     }
    //     d3.json("./assets/data/Java_concepts_tree.json", function(error, json) {
    //         th.setState({data: json});
    //     });
    // }

    getTreeOfDomain(){
        let url = `/domain/domainhomeview/` + this.props.domainName;
        Request
            .get(url)
            .end((err, res) => {
                if(!err) {
                    let domainTree = JSON.parse(res.text);
                    let chart = this.drawChart(domainTree)
                    this.setState({
                        domainName: domainTree.Domain,
                        data: domainTree,
                        chart: chart
                    })
                }
        });
    }

    drawChart(data) {
        let th = this;
        const div = new ReactFauxDOM.Element('div')
        let width = 500;
        let height = 340;
        let n=1;
        let radius = Math.min(width, height) / 2;
        let x = d3.scale.linear()
                    .range([0, 2 * Math.PI]);
        let y = d3.scale.linear().range([0, radius]);
        let color = d3.scale.category20c();

        let trail = d3.select(div).append("svg")
                      .attr('class', 'secondDiv')
                      .attr("width", width+500)
                      .attr("height", 50)
                      .attr("id", "trail");

        let vis = d3.select(div)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("id", "container")
                    .attr("transform", "translate(" + width/2 +","+ height/2 +")");

        vis.append("foreignObject")
            .attr("class", "explanation-obj")
            .attr("width", "175")
            .attr("height", "50")
            .style("z-index", 100)
            .style("cursor", "pointer")
            .attr("transform", function(y) {
                return "translate(-90,-20)"
            })
            .append("xhtml:div")
            .attr("id", "words")
            .attr("class", "wordsDiv");

        let partition = d3.layout.partition()
            .size([2 * Math.PI, radius * radius])
            .value(function(d) { return d.size; });

        let arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))) })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))) })
            .innerRadius(function(d) { return Math.sqrt(d.y); })
            .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

        let path = vis.selectAll("path")
                      .data(partition.nodes(data))
                      .enter().append("path")
                      .attr("d", arc)
                      .attr("fill-rule", "evenodd")
                      .style("fill", function(d) { if(n==1){++n; return '#ddd';} return color(d.name);})
                      .style("opacity", 1)
                      .on("click", click)
                      .on("mouseover", mouseover);
        var text = vis.selectAll("text")
                       .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
                       .attr("x", function(d) { return y(d.y); })
                       .attr("dx", "6") // margin
                       .attr("dy", ".35em") // vertical-align
                       .text(function(d) { return d.name; });
        d3.select("#container").on("mouseleave", mouseleave);
        function click(d) {
            console.log("inside click");
            text.transition().attr("opacity", 0);
            path.transition()
                .duration(750)
                .attrTween("d", arcTween(d));

            th.props.sunSelectedConcept(d.name);
            th.setState({expandable: true});
        }

        d3.select(self.frameElement).style("height", height + "px");

        function arcTween(d) {
            let xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);

            return function(d, i) {
                return i
                    ? function(t) { return arc(d); }
                    : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
            };
        }

        function mouseover(d) {
            d3.select(div)
                .text(d.name);
            d3.select(div)
                .style("visibility", "");

            let sequenceArray = getAncestors(d);
            let targetAttr = $(this).find('div.mouseover').prevObject.attr('style');
            let breadCrumColor = targetAttr.fill;
            updateBreadcrumbs(sequenceArray, breadCrumColor);

            d3.selectAll("path")
                .style("opacity", 0.3);

            vis.selectAll("path")
                .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                })
                .style("opacity", 1);
        }

        function mouseleave(d) {
            d3.select("#trail")
                .style("visibility", "hidden");
            d3.selectAll("path").on("mouseover", null);

            d3.selectAll("path")
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .each("end", function() {
                    // d3.select(this).on("mouseover", mouseover);
                });

            d3.select(div)
            .style("visibility", "hidden");
        }

        function getAncestors(node) {
            let path = [];
            let current = node;
            while (current.parent) {
                path.unshift(current);
                current = current.parent;
            }
            return path;
        }

        let b = {
            w: 100, h: 30, s: 3, t: 10
        };

        function breadcrumbPoints(d, i) {
            let points = [];
            points.push("0,0");
            points.push(b.w + ",0");
            points.push(b.w + b.t + "," + (b.h / 2));
            points.push(b.w + "," + b.h);
            points.push("0," + b.h);
            if (i > 0) { points.push(b.t + "," + (b.h / 2)); }
            return points.join(" ");
        }

        function updateBreadcrumbs(nodeArray, breadCrumColor) {
            let g = d3.select("#trail")
                .style("position", "relative")
                // .style('top', '-300px')
                .selectAll("g")
                .data(nodeArray, function(d) { return d.name + d.depth; });

            let entering = g.enter().append("svg:g");

            entering.append("svg:polygon")
                .attr("points", breadcrumbPoints)
                .style("fill", breadCrumColor);
            entering.append("svg:text")
                .attr("x", (b.w + b.t) / 2)
                .attr("y", b.h / 2)
                .attr("dy", "0.35em")
                .style('text-align', 'justify')
                .style('font-size', '9px')
                .attr("text-anchor", "middle")
                .text(function(d) { return d.name; });

            g.attr("transform", function(d, i) {
                return "translate(" + i * (b.w + b.s) + ", 0)";
            });

            g.exit().remove();
            d3.select("#trail").style("visibility", "");
        }
        function computeTextRotation(d) {
                 return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
                }
        //DOM manipulations done, convert to React
        return div.toReact()
    }

    render() {
        return (
                    <Card>
                        <CardHeader
                        title="Select concept"
                          actAsExpander={true}
                          showExpandableButton={true}
                        />
                        <CardText expandable={this.state.expandable}>
                            {this.state.chart}
                        </CardText>
                    </Card>


            );
    }
}

SunburstView.propTypes = {

};
