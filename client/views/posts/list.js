var momentDateFormat = moment().lang().longDateFormat.L

var updateNewPostForm = function(){
  var categoryId = Session.get('category_id');

  if(categoryId == 'all' || postsHandle == null){
    $('#newPost').hide();
  } else {
    $('#newPost').show();
  }
}

var asDate = function(str){
  var date = (str != null && $.trim(str).length > 0) ? moment(str, momentDateFormat) : null;
  if( date == null ){
    // ok
  } else if( !date.isValid() ) {
    alert("Incorrect date format");
    return null;
  } else {
    date = date.toDate();
  }
  return date;
}

var updateDateFilterInfo = function(){
  var fromDate   = asDate( Session.get('from_date') );
  var toDate     = asDate( Session.get('to_date') );

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

var initPostListDateFilter = function(){
  alert(Session.get("initPostListDateFilter") == null );
  if( Session.get("initPostListDateFilter") == null ){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    Session.set('from_date', moment(firstDay).format(momentDateFormat));
    Session.set("initPostListDateFilter", true);
  }
}

var postsHandle = null;
// Always be subscribed to the posts for the selected category.
Deps.autorun(function () {
  
  initPostListDateFilter();

  var categoryId = Session.get('category_id');

  var fromDate   = asDate( Session.get('from_date') );
  var toDate     = asDate( Session.get('to_date') );

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

  updateNewPostForm();

  // update if data was changed
  updateDateFilterInfo();

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

Template.postList.rendered = function(){
  // update if we switched from another tab
  updateDateSections();
  updateNewPostForm();
  updateDateFilterInfo();

  $('.dropdown-toggle').dropdown()

  // calculate total
  var total = 0;
  $('.post .money').each(function(){
    total += parseInt($(this).html());
  });
  $('#total').html(accounting.formatNumber(total));
}

