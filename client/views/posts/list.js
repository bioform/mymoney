var updateNewPostForm = function(){
  var categoryId = Session.get('category_id');

  if(categoryId == 'all' || postsHandle == null){
    $('#newPost').hide();
  } else {
    $('#newPost').show();
  }
}

var updateDateFilterInfo = function(){
  var fromDate   = Session.get('from_date');
  var toDate     = Session.get('to_date');
  var info = $('#dataFromAndTo');
  var from = $('#dataFrom', info);
  var to   = $('#dataTo', info);


  if(fromDate || toDate){
    info.show();

    if(fromDate){
      $('span', from).html( moment(fromDate).format(momentDateFormat) );
      from.show();
    } else {
      from.hide()
    }

    if(toDate){
      $('span', to).html( moment(toDate).format(momentDateFormat) );
      to.show();
    } else {
      to.hide()
    }


  } else {
    info.hide();
  }

}

var postsHandle = null;
// Always be subscribed to the posts for the selected category.
Deps.autorun(function () {
  var categoryId = Session.get('category_id');
  var fromDate   = Session.get('from_date');
  var toDate     = Session.get('to_date');

  if(fromDate){
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
  }

  if(toDate){
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
  }

  postsHandle    = Meteor.subscribe('posts', categoryId, fromDate, toDate);

  updateDateFilterInfo()

  updateNewPostForm()

});

Template.postList.helpers({
  posts: function () {
    return Post.find({}, {sort: {createdAt: -1}});
  }
});

var updateDateSections = function(){

    var f = "YYYY-MM-DD"
    //delete old recods
    $('.date-label').remove();

    var date = null;
    $(".post").each(function(){
      var post = $(this);
      var val = moment(post.data("date"));
      if(val){
        var curDate = val.format(f);
        if(date != curDate){
          date = moment(curDate).format(f);
          post.before('<p class="date-label text-success" data-date="' + date + '">' + moment(date).calendar() + '</p>')
        }
      }
    });

}

var applayDateFilter = function(e){
      var input = e.currentTarget ? $(e.currentTarget) : e;
      var date = (input.length > 0) ? moment(input.val(), momentDateFormat) : null;
      if( date == null ){
        // ok
      } else if( !date.isValid() ) {
        alert("Incorrect date format");
        return;
      } else {
        date = date.toDate();
      }
      Session.set( input.attr('id'), date );
}

Template.postList.rendered = function(){
  updateDateSections();
  updateNewPostForm();
  $('#from_date, #to_date').datepicker({format: datePickerFormat}).on('changeDate', applayDateFilter);

  $('.dropdown-toggle').dropdown()

  var total = 0;
  $('.post .money').each(function(){
    total += parseInt($(this).html());
  });
  $('#total').html(accounting.formatNumber(total));
}

Template.postList.events({
  'click #date_filter input': function(e){
    e.preventDefault()
    e.stopPropagation()
  },
  'blur #date_filter input': applayDateFilter,
  'click #date_filter .btn.clear': function(e){
    var input = $(e.currentTarget).prev('input');
    input.val('');
    applayDateFilter(input);
  }
})
