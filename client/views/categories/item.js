Template.categoryItem.events({
	'submit form': function(event){
		event.preventDefault();

		var id  = $(event.target).find('[data-id]').data('id')

		Meteor.call('deleteCategory', id, function (error, id){
			if(error){
				Meteor.Errors.throw(error.reason);
			}
			else {
				console.log("===> Deleted")
			}

		});

		return false
	}
});	