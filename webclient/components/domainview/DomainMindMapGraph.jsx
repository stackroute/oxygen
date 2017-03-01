import React from 'react';
import Request from 'superagent';
import Paper from 'material-ui/Paper';
import ReactFauxDOM from 'react-faux-dom';
import $ from 'jquery';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import d3 from 'd3';
let count = 1;
let margin = {
    top: 20,
    right: 80,
    bottom: 20,
    left: 80
};
let width = 1330 - margin.right - margin.left;
let height = 800 - margin.top - margin.bottom;
let i = 0;
let duration = 650;
let root;
let PAGINATION = 2;
export default class DomainMindMapGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: 'Loading...',
            data: {},
            domainName: this.props.domainName,
            expandable: false
        };
    }
    componentDidMount() {
        this.getTreeGraphOfDomain(this.state.domainName);
    }
    getTreeGraphOfDomain(domainName) {
        let url = `/domain/domainview/${domainName}/intents`;
        Request.get(url).end((err, res) => {
            if (!err) {
                let treeData = JSON.parse(res.text);
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
        });

        let diagonal = d3.svg.diagonal().projection(function(d) {
            return [d.y, d.x];
        });

        let svg = d3.select(".domainView").append("svg").attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let color = d3.scale.category20c();

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
                d.y = d.depth * 300;
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
                    ? "lightsteelblue"
                    : "#fff";
            });

            nodeEnter.append("text").attr("x", function(d) {
                return d.Children || d._children
                    ? 25
                    : -20;
            }).attr("dy", "2.5em").attr("text-anchor", function(d) {
                return d.Children || d._children
                    ? "end"
                    : "start";
            }).text(function(d) {
                return d.name;
            }).style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            let nodeUpdate = node.transition().duration(duration).attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

            nodeUpdate.select("circle").attr("r", 13).style("fill", function(d) {
                return d._children
                    ? '#76d7c4'
                    : 'white';
            });

            // nodeUpdate.select("circle").attr("r", 10).style("fill", function(d) {
            //     var sam = d.parent
            //         ? color(d.parent.id)
            //         : color();
            //     console.log(sam);
            //     return d._children
            //         ? "white"
            //         : sam;
            // });

            nodeUpdate.select("text").style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            let nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            }).remove();

            nodeExit.select("circle").attr("r", 1e-6);

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
                return diagonal({source: o, target: o});
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
                        ? (p2.x - 45)
                        : (p1.x + 45);
                    return "translate(" + x + "," + y + ")";
                }).on("click", paginate);

                pageControl.append("image").attr("xlink:href", function(d) {
                    if (d.type == "next") {
                        return '../../assets/images/arrow_forward1x.png';
                        // return '../../assets/images/redo_black1x.png';
                    } else {
                        return '../../assets/images/arrow_back1x.png';
                        // return '../../assets/images/undo_black1x.png';
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
            <div className="domainView">

                <h1 style={{
                    marginTop: '5%',
                    color: 'rgb(0,128, 128)',
                    textAlign: 'center',
                    fontFamily: 'sans-serif'
                }}>Ontology Visualizer Of {this.state.domainName}</h1>
                {this.state.graph}
            </div>
        );
    }
}
