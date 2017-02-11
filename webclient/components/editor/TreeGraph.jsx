import React from 'react';
import Request from 'superagent';
import Paper from 'material-ui/Paper';
import ReactFauxDOM from 'react-faux-dom';
import $ from 'jquery';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import d3 from 'd3';
var count = 1;
let margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    },
    width = 960 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom;
let i = 0,
    duration = 750,
    root;
let PAGINATION = 6;
export default class TreeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: 'Loading...',
            data: {},
            domainName: 'Java Web Application Development',
            expandable: false
        }
    }
    componentDidMount() {
        this.getTreeGraphOfDomain();
    }
    getTreeGraphOfDomain() {
        let url = `/domain/domainhomeview/Java Web Application Development`;
        Request.get(url).end((err, res) => {
            if (!err) {
                let treeData = JSON.parse(res.text);
                treeData = JSON.stringify(treeData);
                treeData = treeData.replace("children", "kids");
                treeData = JSON.parse(treeData);
                treeData = [treeData];
                this.setState({data: treeData, graph: treeGraph});
                let treeGraph = this.drawTreeGraph(this.state.data);
            }
        });
    }
    drawTreeGraph(treeData) {
        const div = new ReactFauxDOM.Element('div');
        let tree = d3.layout.tree().size([height, width]).separation(function separation(a, b) {
            return a.parent == b.parent
                ? 1
                : 3;
        });;
        let diagonal = d3.svg.diagonal().projection(function(d) {
            return [d.y, d.x];
        });
        let svg = d3.select(".treeGraph").append("svg").attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        let color = d3.scale.category20();
        root = treeData[0];
        root.x0 = height / 2;
        root.y0 = 0;
        reset(root)
        update(root);

        function update(source) {
            // Compute the new tree layout.
            let nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            // Normalize for fixed-depth.

            nodes.forEach(function(d) {
                d.y = d.depth * 180;
            });

            // Update the nodes…
            let node = svg.selectAll("g.node").data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });
            // Enter any new nodes at the parent's previous position.
            let nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            }).on("click", click);
            nodeEnter.append("circle").attr("r", 1e-6).style("fill", function(d) {
                return d._children
                    ? "white"
                    : "white";
            });
            nodeEnter.append("text").attr("x", function(d) {
                return d.Children || d._children
                    ? -13
                    : 13;
            }).attr("dy", ".35em").attr("text-anchor", function(d) {
                return d.Children || d._children
                    ? "end"
                    : "start";
            }).text(function(d) {
                return d.name;
            }).style("fill", 1e-6);
            // Transition nodes to their new position.
            let nodeUpdate = node.transition().duration(duration).attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
            nodeUpdate.select("circle").attr("r", 10).style("fill", function(d) {
                let sam = d.parent
                    ? color(d.parent.id)
                    : color();
                console.log(sam);
                return d._children
                    ? "#9B59B6"
                    : "white";
            });
            nodeUpdate.select("text").style("fill-opacity", 1);
            // Transition exiting nodes to the parent's new position.
            let nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            }).remove();
            nodeExit.select("circle").attr("r", 1e-6).style("fill");
            nodeExit.select("text").style("fill-opacity", 1e-6);
            // Update the links…
            let link = svg.selectAll("path.link").data(links, function(d) {
                return d.target.id;
            });
            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g").attr("class", "link").attr("d", function(d) {
                let o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({source: o, target: o});
            });
            // Transition links to their new position.
            link.transition().duration(duration).attr("d", diagonal);
            // Transition exiting nodes to the parent's new position.
            link.exit().transition().duration(duration).attr("d", function(d) {
                let o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({source: o, target: o});;
            }).remove();
            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
            let parents = nodes.filter(function(d) {
                return (d.kids && d.kids.length > PAGINATION)
                    ? true
                    : false;
            });
            svg.selectAll(".page").remove();
            parents.forEach(function(p) {
                if (p._children)
                    return;
                let p1 = p.children[p.children.length - 1];
                let p2 = p.children[0];
                let pagingData = [];
                if (p.page > 1) {
                    pagingData.push({
                        type: "prev",
                        parent: p,
                        no: (p.page - 1)
                    });
                }
                if (p.page < Math.ceil(p.kids.length / PAGINATION)) {
                    pagingData.push({
                        type: "next",
                        parent: p,
                        no: (p.page + 1)
                    });
                }
                let pageControl = svg.selectAll(".page").data(pagingData, function(d) {
                    return (d.parent.id + d.type);
                }).enter().append("g").attr("class", "page").attr("transform", function(d) {
                    let x = (d.type == "next")
                        ? p2.y
                        : p1.y;
                    let y = (d.type == "prev")
                        ? (p2.x - 30)
                        : (p1.x + 30);
                    return "translate(" + x + "," + y + ")";
                }).on("click", paginate);
                pageControl.append("circle").attr("r", 15).style("fill", function(d) {
                    return d.parent
                        ? color(d.parent.id)
                        : color();
                })
                pageControl.append("image").attr("xlink:href", function(d) {
                    if (d.type == "next") {
                        return "https://dl.dropboxusercontent.com/s/p7qjclv1ulvoqw3/icon1.png"
                    } else {
                        return "https://dl.dropboxusercontent.com/s/mdzt36poc1z39s3/icon3.png"
                    }
                }).attr("x", -12.5).attr("y", -12.5).attr("width", 25).attr("height", 25);
            });
        }
        function paginate(d) {
            console.log(d, "data")
            d.parent.page = d.no;
            setPage(d.parent);
            update(root);
        }
        function setPage(d) {
            if (d && d.kids) {
                d.children = [];
                d.kids.forEach(function(d1, i) {
                    if (d.page === d1.pageNo) {
                        d.children.push(d1);
                    }
                })
            }
        }
        function reset(d) {
            if (d && d.kids) {
                d.page = 1;
                d.children = [];
                d.kids.forEach(function(d1, i) {
                    d1.pageNo = Math.ceil((i + 1) / PAGINATION);
                    if (d.page === d1.pageNo) {
                        d.children.push(d1)
                    }
                    //console.log(d);
                    reset(d1);
                })
            }

        }
        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
        return div.toReact();
    }
    render() {
        return (
              <Card>
                  <CardHeader
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardText expandable={this.state.expandable}>
                      {this.state.graph}
                  </CardText>
              </Card>
        );
    }
}
