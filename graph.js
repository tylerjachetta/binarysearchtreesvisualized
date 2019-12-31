// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.selectAll(".graph").append("svg").attr("viewBox", [-250, 170, 500, 45])
    .attr("width", "100%")
    .attr("height", "94%");

var g = svg.append("g")
    .attr("class", "container")
    .attr("transform", "translate(" + 0 + "," + margin.top + ")");

svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0, 8])
    .on("zoom", function() {
        d3.select(this).select(".container").attr("transform", d3.event.transform);
    }));

function myXOR(a,b) {
    return ( a || b ) && !( a && b );
}


var textBox = document.getElementById('value');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function InsertNode() {
  var val = Number(textBox.value || getRandomInt(-1000, 1000));
  textBox.focus();
  if(!isNaN(val)) {
    BST.InsertVal(val);
    drawTree(BST);
    AVL.InsertVal(val);
    drawTree(AVL);
    Splay.InsertVal(val);
    drawTree(Splay);
  }
  textBox.value = '';
}

function DeleteNode() {
  var val = Number(textBox.value || getRandomInt(0, 1000));
  textBox.value = '';
  if(!isNaN(val)) {
    textBox.focus();
    BST.DeleteVal(val);
    drawTree(BST);
    AVL.DeleteVal(val);
    drawTree(AVL);
    Splay.DeleteVal(val);
    drawTree(Splay);
  }
}

var i;

function drawTree(Tree) {
  
  d3.select("." + Tree.treeType).selectAll(".node").remove();
  d3.select("." + Tree.treeType).selectAll(".link").remove();
  
  if(Tree.root == null)
    return;

  var container = d3.select("." + Tree.treeType).select("g");

  root = d3.hierarchy(Tree.root, function(d){
    d.children=[];
    if (d.left){
        d.children.push(d.left);
        if (myXOR(d.left, d.right)){
            d.children.push(new Node("e"));
        }
    }
    if (d.right){
        if (myXOR(d.left, d.right)){
            d.children.push(new Node("e"));
        }
        d.children.push(d.right);
    }
    return d.children; 
  });
  root.x0 = height / 2;
  root.y0 = 0;

  var treemap = d3.tree().size([height, width]).nodeSize([40,40]).separation(function separation(a, b) {
    if(a.parent == b.parent)
      return 2;
    else
      return 1;
  });;
  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 90}); //90?

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = container.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + root.x0 + "," + root.y0 + ")";
    });

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .attr('cursor', 'pointer')
      .style("fill",  function(d) {
        return d.data.value != "e" ? "white" : "#b1b1b1";
    });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { 
        return d.data.value != "e" ? d.data.value : "null";
      });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.attr("transform", function(d) { 
    return "translate(" + d.x + "," + d.y + ")";
  });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 15)
    .style("fill",  function(d) {
        return d.data.value != "e" ? "white" : "#b1b1b1";
    })
    .attr('cursor', 'pointer')
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);; 

  function handleMouseOver(d, i) {  // Add interactivity
    console.log("Value: " + d.data.value + " Parent: " + (d.data.parent ? d.data.parent.value: "null ") + " Left: " + (d.data.left ? d.data.left.value: "null ") + " Right: " + (d.data.right ? d.data.right.value: "null "));
    // Use D3 to select element, change color and size
    d3.select(this).style("fill", "orange");
    // Specify where to put label of text
    container.append("text")
    .attr("id", "hover")
    .attr("x", d.x + 15)
    .attr("y", d.y - 15)
    .text(function() {
      return "Height: " + d.data.height + " Balance: " + d.data.balance + " Depth: " + d.depth;  // Value of the text
    });
  }

  function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    if(d.data.value != "e"){
      d3.select(this).style("fill", "white");
    }
    else{
      d3.select(this).style("fill", "#b1b1b1");
    }
    // Select text by id and then remove
    d3.selectAll("#hover").remove();  // Remove text location
  }


  // ****************** links section ***************************

  // Update the links...
  var link = container.selectAll('path.link')
    .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
    .attr("class", "link")
    .attr('d', function(d){
      var o = {x: root.x0, y: root.y0}
      return diagonal(o, o)
  });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.attr('d', function(d){ 
    return diagonal(d, d.parent) 
  });

  // Remove any exiting links
  var linkExit = link.exit()
    .attr('d', function(d) {
      var o = {x: root.x, y: root.y}
      return diagonal(o, o)
    })
    .remove();

  d3.select("." + Tree.treeType).select("span").text(Tree.root.height);
}

// Creates a curved (diagonal) path from parent to the child nodes
function diagonal(s, d) {
  path = `M ${s.x} ${s.y}
          C ${(s.x + d.x) / 2} ${s.y},
            ${(s.x + d.x) / 2} ${d.y},
            ${d.x} ${d.y}`
  return path
}