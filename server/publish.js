Meteor.publish("categories", function () {
	return Category.find({userId: this.userId});
});

// Publish all items for requested list_id.
Meteor.publish('posts', function (categoryId, fromDate, toDate) {
  check(categoryId, String);
  var conditions = {userId: this.userId}

  if( categoryId != 'all' ){
  	conditions.categoryId = categoryId
  }
  if( fromDate != null ){
  	conditions.createdAt = {$gte: fromDate}
  }

  if( toDate != null ){
  	if(conditions.createdAt == null){
  		conditions.createdAt = {}
  	}
	conditions.createdAt.$lt = toDate
  }

  return Post.find(conditions);

});
