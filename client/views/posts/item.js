Template.postItem.events({
	'submit form': function(event){
		event.preventDefault();

		var postId  = $(event.target).find('[data-id]').data('id')

		Meteor.call('deletePost', postId, function (error, id){
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

Template.postItem.helpers({
  date: function () {
    return this.createdAt ? this.createdAt.getTime() : "";
  }
});