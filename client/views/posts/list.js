var updateNewPostForm = function(){
  var categoryId = Session.get('category_id');

  if(categoryId == 'all' || postsHandle == null){
    $('#newPost').hide();
  } else {
    $('#newPost').show();
  }
}

var postsHandle = null;
// Always be subscribed to the posts for the selected category.
Deps.autorun(function () {

  var categoryId = Session.get('category_id');

  postsHandle = Meteor.subscribe('posts', categoryId);

  updateNewPostForm()

});

Template.postList.helpers({
  posts: function () {
    return Post.find({}, {sort: {submitted: -1}});
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
  updateDateSections();
  updateNewPostForm()
}
