/**
 * in Meteor the usage of 'var' limits the variable
 * to the current file, but we want to have this collecion
 * available on both client and server, so we're kinda
 * making it global 
 */
Post = new Meteor.Collection('posts');


Meteor.methods({

	post: function(attrs){

		var user = Meteor.user();

		if(!user)
			throw new Meteor.Error(401, 'You need to login to post new stuff!');

		if(!attrs.title)
			throw new Meteor.Error(422, 'Please fill in the title');

		if(!attrs.categoryId)
			throw new Meteor.Error(422, 'Please fill in the categoryId');

		attrs.amount = parseInt(attrs.amount);

		var post = _.extend(_.pick(attrs, 'amount','title', 'categoryId', 'createdAt'),
						{
							userId: user._id,
							submitted: new Date(),
							year: attrs.createdAt.getYear(),
							month: attrs.createdAt.getMonth(),
						}
		);


		var id = Post.insert(post);

		return id;

	},

	deletePost: function(id){

		var user = Meteor.user();

		if(!user)
			throw new Meteor.Error(401, 'You need to login to post new stuff!');

		Post.remove({_id: id, userId: user._id});

		return id;

	}

});

Post.allow({
	insert: function(userId, doc){
		// only if you're logged in
		return !! userId;
	}
});

Post.allow({
	update: ownsDocument,
	remove: ownsDocument
});

Post.deny({
	update: function(userId, post, fieldNames){
		// only allowed to edit these two
		return ( _.without(fieldNames, 'amount', 'title', 'createdAt').length > 0 );
	}
})