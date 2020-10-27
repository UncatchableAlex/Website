function QueueNode(data){
	this.data = data;
	this.next;
}

function Queue(){
	this.head;
	this.tail;
	this.length = 0;
}

Queue.prototype.push = function(data){
	var newNode = new QueueNode(data);
	if(this.tail != null){
		this.tail.next = newNode;
	}
	if(this.head == null){
		this.head = newNode;
	}
	this.tail = newNode;
	this.length++;
}

Queue.prototype.poll = function(data){
	if(this.length == 0){
		throw "Queue is empty. Can't poll";
	}
	oldHead = this.head;
	this.head = oldHead.next;
	this.length--;
	return oldHead.data;
}
Queue.prototype.toString = function(){
	str = "[";
	currNode = this.head;
	while(currNode != null){
		str += (currNode.data.toString() + ", ");
		currNode = currNode.next;
	}
	return this.isEmpty() ? "[]" : str.substring(0, str.length - 2) + "]";
}
Queue.prototype.isEmpty = function(){
	return this.length == 0;
}

