/** 
 * router
 */
Meteor.Router.add ({
	'/':      'home',
	'/posts': {
		to: 'postsPage',
		and: function() { Session.set ('category_id', 'all');}
	},
	'/posts/:category_id': {
		as: 'postList',
		to: function(category_id){
			Session.setDefault('category_id', category_id);
			return 'postsPage'
		}
	},
	'/categories': 'categoryList',
});

Meteor.Router.filters({
	'requireLogin': function(page){
		if(Meteor.user())
			return page;
		else if (Meteor.loggingIn())
			return 'loading'
		else
			return 'accessDenied';
	},

	'clearError': function(page){
		Meteor.Errors.clear();
		return page;
	}

});

Meteor.Router.filter('requireLogin', {only: ['posts/list']});
Meteor.Router.filter('clearError');