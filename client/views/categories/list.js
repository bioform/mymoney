Template.categoryList.helpers({
	categories: function () {
		return Category.find({}, {sort: {title: 1}});
	}
});

Template.categoryList.events({
	'submit form': function(event){
		event.preventDefault();

		var title  = $(event.target).find('[name=title]')

		var data = { title: title.val() }	

		Meteor.call('createCategory', data, function (error, id){
			if(error){
				Meteor.Errors.throw(error.reason);
			}
			else {
				title.val("")
			}
		});


	}
});	