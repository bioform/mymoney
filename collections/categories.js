/**
 * in Meteor the usage of 'var' limits the variable
 * to the current file, but we want to have this collecion
 * available on both client and server, so we're kinda
 * making it global 
 */
Category = new Meteor.Collection('categories');


Meteor.methods({

	createCategory: function(attrs){

		var user = Meteor.user();

		if(!user)
			throw new Meteor.Error(401, 'You need to login to category new stuff!');

		if(!attrs.title)
			throw new Meteor.Error(422, 'Please fill in the title');

		var category = _.extend(_.pick(attrs, 'title'),
						{
							userId: user._id,
							submitted: new Date()
						}
		);

		var id = Category.insert(category);

		return id;

	},

	deleteCategory: function(id){

		var user = Meteor.user();

		if(!user)
			throw new Meteor.Error(401, 'You need to login to category new stuff!');

		Category.remove({_id: id, userId: user._id});

		return id;

	}

});

Category.allow({
	insert: function(userId, doc){
		// only if you're logged in
		return !! userId;
	}
});

Category.allow({
	update: ownsDocument,
	remove: ownsDocument
});

Category.deny({
	update: function(userId, category, fieldNames){
		// only allowed to edit this one
		return ( _.without(fieldNames, 'title').length > 0 );
	}
})