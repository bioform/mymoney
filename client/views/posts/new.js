Template.newPost.rendered = function(){
  var datepicker = $('#new_post_date').datepicker({format: datePickerFormat})
}

Template.newPost.events({
  'submit form': function(event){
    event.preventDefault();

    var title  = $(event.target).find('[name=title]')
    var amount = $(event.target).find('[name=amount]')
    var date   = $(event.target).find('[name=date]')

    var amountVal = parseInt(amount.val());
    if( isNaN(amountVal) ){
      return alert("Define amount please");
    }

    date = (date.length > 0) ? moment(date.val(), momentDateFormat) : null;

    if( date == null ){
      date = new Date();
    } else if( !date.isValid() ) {
      alert("Incorrect date format");
      return;
    } else {
      date = date.toDate()
    }

    

    var categoryId = Session.get('category_id');
    if( categoryId == 'all' ){
      categoryId = null;
    }

    var post = {

      title: title.val(),
      amount: amountVal,
      categoryId: categoryId,
      createdAt: date
    } 

    Meteor.call('post', post, function (error, id){
      if(error){
        Meteor.Errors.throw(error.reason);
      }
      else {
        title.val("")
        amount.val("")
        //alert('ok');
      }

    });


  }
}); 