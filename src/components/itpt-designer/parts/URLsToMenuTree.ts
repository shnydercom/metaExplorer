export const treeDemoData = [{
  "title": "Food",
  "path": "/root",
}, {
  "title": "Cloths",
  "path": "/root",
}, {
  "title": "Veg",
  "path": "/root/Food",
}, {
  "title": "Brinjal",
  "path": "/root/Food/Veg",
}, {
  "title": "T shirt",
  "path": "/root/Cloths",
}, {
  "title": "Shirt",
  "path": "/root/Cloths",
}, {
  "title": "Green brinjal",
  "path": "/root/Food/Veg/Brinjal",
}, {
  "title": "Test cloth",
  "path": "/root/Cloths/Shirt",
}];

export class URLToMenuTree<T> {
  retrieveTitleFn: (itm: T) => string;
  retrievePathFn: (itm: T) => string;
  constructor(retrieveTitleFn: (itm: T) => string, retrievePathFn: (itm: T) => string){
    this.retrievePathFn = retrievePathFn;
    this.retrieveTitleFn = retrieveTitleFn;
  }
  // Add an item node in the tree, at the right position
  addToTree(node, treeNodes) {
    var parentNode = this.GetTheParentNodeChildArray(this.retrievePathFn(node), treeNodes) || treeNodes;

    parentNode.push({
      title: this.retrieveTitleFn(node),
      path: this.retrievePathFn(node),
      elem: node,
      children: []
    });
  }

  GetTheParentNodeChildArray(path, treeNodes) {
    for (var i = 0; i < treeNodes.length; i++) {
      var treeNode = treeNodes[i];

      if (path === (treeNode.path + treeNode.title)) {
        return treeNode.children;
      }
      else if (treeNode.children.length > 0) {
        var possibleParent = false;

        treeNode.children.forEach((item) => {
          if (path.indexOf(item.path + '/' + item.title) === 0) {
            possibleParent = true;
            return false;
          }
        });

        if (possibleParent) {
          return this.GetTheParentNodeChildArray(path, treeNode.children);
        }
      }
    }
  }

  //Create the item tree starting from menuItems
  createTree(nodes: T[]) {
    var tree = [];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      this.addToTree(node, tree);
    }
    return tree;
  }
}
