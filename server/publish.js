Meteor.publish("categories", function () {
	return Category.find({userId: this.userId});
});

// Publish all items for requested list_id.
Meteor.publish('posts', function (categoryId) {
  check(categoryId, String);

  if( categoryId == 'all' ){
  	return Post.find({userId: this.userId});
  } else {
  	return Post.find({categoryId: categoryId, userId: this.userId});
  }
  
});