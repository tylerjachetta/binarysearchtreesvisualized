var BST = new BinaryTree("BST");
var AVL = new BinaryTree("AVL");
var Splay = new BinaryTree("Splay");

function myCallback() {
	// console.log("hello");
	var random = Math.floor(Math.random() * (1000 - -1000)) + -1000;
	//console.log("Inserting " + random)
	BST.InsertVal(random);
	setTimeout(function(){ 
		//console.log("Deleting " + random)
		BST.DeleteVal(random); 
		drawTree();
	}, Math.floor(Math.random() * (5000 - 1000)) + 1000);
	drawTree();
}


function Node(val = null) {
	this.value = val; 
	this.parent = null;
	this.height = 0;
	this.left = null;
	this.right = null;
	this.balance = 0;
	this.UpdateHeight = function() {
		this.height = (this.left || this.right ? 1 : 0) + Math.max((this.left != null ? this.left.height : 0), (this.right != null ? this.right.height : 0));
	}
	this.UpdateBalance = function() {
		this.balance = (this.right != null ? this.right.height : -1 ) - (this.left != null ? this.left.height : -1 );
	}

	this.LeftChild = function() {
		if(this.parent == null)
			return false;
		else 
			return (this.parent.left && this.value == this.parent.left.value);
	}

	this.RightChild = function() {
		if(this.parent == null)
			return false;
		else 
			return (this.parent.right && this.value == this.parent.right.value);
	}
}


function BinaryTree(type) {
	this.treeType = type;
	this.root = null;
	this.size = 0;
	this.message = "";

	this.InsertVal = function(val) {
		if(this.root == null)
			this.root = new Node(val);
		else 
		{
			if(this.treeType == "AVL")
				this.InsertAVL(this.root, val);
			else if(this.treeType == "Splay")
				this.InsertSplay(this.root, val);
			else if(this.treeType == "BST")
				this.InsertBST(this.root, val);
		}
	}

	this.InsertAVL = function(cur, val) {
		if(val < cur.value)
		{
			if(cur.left == null)
			{
				cur.left = new Node(val);
				cur.left.parent = cur;
			}
			else
				this.InsertAVL(cur.left, val)
		}
		else if(val > cur.value)
		{
			if(cur.right == null)
			{
				cur.right = new Node(val);
				cur.right.parent = cur;
			}
			else
				this.InsertAVL(cur.right, val)
		}
		else if(val == cur.value)
			return;

		cur.UpdateHeight();
		cur.UpdateBalance();
		this.BalanceNode(cur);
	}

	this.InsertSplay = function(cur, val) {
		if(val < cur.value)
		{
			if(cur.left == null)
			{
				cur.left = new Node(val);
				cur.left.parent = cur;
				this.Splay(cur.left);
			}
			else
				this.InsertSplay(cur.left, val)
		}
		else if(val > cur.value)
		{
			if(cur.right == null)
			{
				cur.right = new Node(val);
				cur.right.parent = cur;
				this.Splay(cur.right);
			}
			else
				this.InsertSplay(cur.right, val)
		}
		else if(val == cur.value)
			return;

		cur.UpdateHeight();
		cur.UpdateBalance();
	}
	
	this.InsertBST = function(cur, val) {
		if(val < cur.value)
		{
			if(cur.left == null)
			{
				cur.left = new Node(val);
				cur.left.parent = cur;
			}
			else
				this.InsertBST(cur.left, val)
		}
		else if(val > cur.value)
		{
			if(cur.right == null)
			{
				cur.right = new Node(val);
				cur.right.parent = cur;
			}
			else
				this.InsertBST(cur.right, val)
		}
		else if(val == cur.value)
			return;

		cur.UpdateHeight(); //Balance and Height are not necessary for 
		cur.UpdateBalance();// a simple BST, but keeping track for GUI
	}

	this.SplayLeftRotate = function(cur) {
	  var y = cur.right;
	  if(y) {
	    cur.right = y.left;
	    if( y.left ) y.left.parent = cur;
	    y.parent = cur.parent;
	  }  
	  if( !cur.parent ) this.root = y;
	  else if( cur == cur.parent.left ) cur.parent.left = y;
	  else cur.parent.right = y;
	  if(y) y.left = cur;
	  cur.parent = y;

	  cur.UpdateHeight();
	  cur.UpdateBalance();

	}
	
	this.SplayRightRotate = function(cur) {
	  var y = cur.left;
	  if(y) {
	    cur.left = y.right;
	    if( y.right ) y.right.parent = cur;
	    y.parent = cur.parent;
	  }
	  if( !cur.parent ) this.root = y;
	  else if( cur == cur.parent.left ) cur.parent.left = y;
	  else cur.parent.right = y;
	  if(y) y.right = cur;
	  cur.parent = y;
	  cur.UpdateHeight();
	  cur.UpdateBalance();
	}
	
	this.Splay = function(cur) {
	  while( cur.parent ) {
	    if( !cur.parent.parent ) {
	      if( cur.parent.left == cur ) this.SplayRightRotate( cur.parent );
	      else this.SplayLeftRotate( cur.parent );
	    } else if( cur.parent.left == cur && cur.parent.parent.left == cur.parent ) {
	      this.SplayRightRotate( cur.parent.parent );
	      this.SplayRightRotate( cur.parent );
	    } else if( cur.parent.right == cur && cur.parent.parent.right == cur.parent ) {
	      this.SplayLeftRotate( cur.parent.parent );
	      this.SplayLeftRotate( cur.parent );
	    } else if( cur.parent.left == cur && cur.parent.parent.right == cur.parent ) {
	      this.SplayRightRotate( cur.parent );
	      this.SplayLeftRotate( cur.parent );
	    } else {
	      this.SplayLeftRotate( cur.parent );
	      this.SplayRightRotate( cur.parent );
	    }
	    cur.UpdateHeight();
	    cur.UpdateBalance();
	  }
	}
	
	this.FindVal = function(val) { 
		return this.Find(this.root, val);
	}

	this.FindMinVal = function(cur)
	{
		if(cur.left)
			return this.FindMinVal(cur.left)
		else
			return cur;
	}

	this.Find = function(cur, val) {
		if(cur == null)
			return null;
		else if(val < cur.value)
			return this.Find(cur.left, val)
		else if (val > cur.value)
			return this.Find(cur.right, val)
		else
			return cur;
	}

	this.DeleteVal = function(val) {
		if(this.root == null)
			return;
		else 
		{
			if(this.treeType == "AVL")
				this.DeleteAVL(this.root, val);
			else if(this.treeType == "Splay")
				this.DeleteSplay(this.root, val);
			else if(this.treeType == "BST")
				this.DeleteBST(this.root, val);
		}
	}


	this.DeleteAVL = function(cur, val) {
		if(cur == null) //Doesn't exist in tree
			return; 
		else if(val < cur.value)
		{
			this.DeleteAVL(cur.left, val);
		}
		else if(val > cur.value)
		{
			this.DeleteAVL(cur.right, val);
		}
		else if(val == cur.value) 
		{
			if(cur.left && cur.right) //Two Children, replace with min of right subtree
			{
				var min = this.FindMinVal(cur.right);
				this.DeleteVal(min.value);
				cur.value = min.value;
			}
			else if(cur.left) //Left Child Only, replace w/child
			{
				cur.left.parent = cur.parent;
				if(cur == this.root)
					this.root = cur.left;
				else if(cur.parent.left != null && cur.value == cur.parent.left.value)
					cur.parent.left = cur.left;
				else
					cur.parent.right = cur.left;
			}
			else if(cur.right) //Right Child Only, replace w/child
			{
				cur.right.parent = cur.parent;
				if(cur == this.root)
					this.root = cur.right;
				else if(cur.parent.left != null && cur.value == cur.parent.left.value)
					cur.parent.left = cur.right;
				else
					cur.parent.right = cur.right;
			}
			else if(!cur.left && !cur.right) //No Children
			{
				if(cur == this.root)
					this.root = null;
				else if(cur.parent.left != null && cur.value == cur.parent.left.value)
					cur.parent.left = null;
				else
					cur.parent.right = null;
			}
		}
		cur.UpdateHeight();
		cur.UpdateBalance();
		this.BalanceNode(cur);
	}

	this.DeleteSplay = function(cur, val) {
		if(cur == null) //Doesn't exist in tree
			return; 
		else if(val < cur.value)
		{
			this.DeleteBST(cur.left, val);
		}
		else if(val > cur.value)
		{
			this.DeleteBST(cur.right, val);
		}
		else if(val == cur.value) 
		{
			this.Splay(cur);
			this.DeleteBST(cur, val);
		}
		cur.UpdateHeight();
		cur.UpdateBalance();
	}

	this.DeleteBST = function(cur, val) {
		if(cur == null) //Doesn't exist in tree
			return; 
		else if(val < cur.value)
		{
			this.DeleteBST(cur.left, val);
		}
		else if(val > cur.value)
		{
			this.DeleteBST(cur.right, val);
		}
		else if(val == cur.value) 
		{
			if(cur.left && cur.right) //Two Children, replace with min of right subtree
			{
				var min = this.FindMinVal(cur.right);
				this.DeleteVal(min.value);
				cur.value = min.value;
			}
			else if(cur.left) //Left Child Only, replace w/child
			{
				cur.left.parent = cur.parent;
				if(cur == this.root)
					this.root = cur.left;
				else if(cur.parent.left != null && cur.value == cur.parent.left.value)
					cur.parent.left = cur.left;
				else
					cur.parent.right = cur.left;
			}
			else if(cur.right) //Right Child Only, replace w/child
			{
				cur.right.parent = cur.parent;
				if(cur == this.root)
					this.root = cur.right;
				else if(cur.parent.left != null && cur.value == cur.parent.left.value)
					cur.parent.left = cur.right;
				else
					cur.parent.right = cur.right;
			}
			else if(!cur.left && !cur.right) //No Children
			{
				if(cur == this.root)
					this.root = null;
				else if(cur.parent.left != null && cur.value == cur.parent.left.value)
					cur.parent.left = null;
				else
					cur.parent.right = null;
			}
		}
		cur.UpdateHeight();
		cur.UpdateBalance();
	}

	this.BalanceNode = function(cur) 
	{
		//console.log(this.root);
		// Left Left Case  
		if(cur.balance > 1 && cur.right != null && cur.right.balance >= 0) //RR Heavy   
		{
			//console.log(cur.value + " RR Heavy")
			this.LeftRotate(cur);
		}	  
    	// Right Right Case  
    	else if(cur.balance < -1 && cur.left != null && cur.left.balance <= 0) //LL Heavy
    	{
    		//console.log(cur.value + " LL Heavy")
    		this.RightRotate(cur);
    	} 
    	// Right Left Case  
    	else if(cur.balance < -1 && cur.left != null && cur.left.balance >= 0) //LR Heavy
    	{  
    		//console.log(cur.value + " LR Heavy")
        	this.LeftRotate(cur.left);  
        	this.RightRotate(cur);
    	}   
    	//Left Right Case
    	else if(cur.balance > 1 && cur.right != null && cur.right.balance <= 0) //RL Heavy
    	{  
    		//console.log(cur.value + " RL Heavy")
        	this.RightRotate(cur.right)
        	this.LeftRotate(cur);  
    	}  
	    //console.log(this.root);
	}

	this.RightRotate = function(a) 
	{
		var b = a.left;
		var T = b.right;

		b.right = a; 
		b.parent = a.parent;

		a.parent = b;
		a.left = T;

		this.RepairTree(a, b, T); 
	}

	this.LeftRotate = function(a) 
	{
		var b = a.right;
		var T = b.left;

		b.left = a; 
		b.parent = a.parent;

		a.parent = b;
		a.right = T;

		this.RepairTree(a, b, T); 
	}

	//Auxiliary Function for AVL Rotations 
	this.RepairTree = function(a, b, T)
	{
		if(a == this.root) //If was root, make b root
			this.root = b;
		else
		{
			if(b.parent.left == a) //Make a the appropiate 
				b.parent.left = b  //left/right child of b 
			else
				b.parent.right = b;
		}
		if(T != null) //Make 
			T.parent = a;
		a.UpdateHeight();
		b.UpdateHeight();
		a.UpdateBalance();
		b.UpdateBalance();
	}


}
