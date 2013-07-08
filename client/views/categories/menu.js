// ID of currently selected category
Session.setDefault('category_id', null);
// When editing a category name, ID of the list
Session.setDefault('editing_category', null);

// Subscribe to 'categories' collection on startup.
// Select a category once data has arrived.
var categoriesHandle = Meteor.subscribe('categories', function () {
  /*
  if (!Session.get('category_id')) {
    var category = Category.findOne({}, {sort: {title: 1}});
    if (category)
      Router.setCategory(category._id);
  }
  */
});

Template.categoryMenu.helpers({
  categories: function () {
    return Category.find({}, {sort: {title: 1}});
  }
})


////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {

      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};

// Attach events to keydown, keyup, and blur on "New list" input box.
Template.categoryMenu.events(okCancelEvents(
  '#new-category',
  {
    ok: function (text, evt) {

      Meteor.call('createCategory', { title: text }, function (error, id){
        if(error){
          Meteor.Errors.throw(error.reason);
        }
        else {
          Router.setCategory(id);
          evt.target.value = "";
        }
      });

    }
  }));

Template.categoryMenu.events(okCancelEvents(
  '#category-name-input',
  {
    ok: function (value) {
      Category.update(this._id, {$set: {title: value}});
      Session.set('editing_category', null);
    },
    cancel: function () {
      Session.set('editing_category', null);
    }
  }));

Template.categoryMenu.events({
  'mousedown .category': function (evt) { // select list
    if(typeof this._id == 'undefined'){
      this._id = 'all';
    }
    Router.setCategory(this._id);
  },
  'click .category': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
  },
  'dblclick .category': function (evt, tmpl) { // start editing list name
    if(this._id){
      Session.set('editing_category', this._id);
      Deps.flush(); // force DOM redraw, so we can focus the edit field
      activateInput(tmpl.find("#category-name-input"));
    }
  }
});

Template.categoryMenu.loading = function () {  
  return !categoriesHandle.ready();
};

Template.categoryMenu.selected = function () {
  return Session.equals('category_id', this._id) ? 'active' : '';
};
Template.categoryMenu.selectedAll = function () {
  return Session.equals('category_id', 'all') ? 'active' : '';
};

Template.categoryMenu.editing = function () {
  return Session.equals('editing_category', this._id);
};

////////// Tracking selected category in URL //////////

var PostsRouter = Backbone.Router.extend({
  routes: {
    "posts/:category_id": "page",
    "stats/:category_id": "page"
  },
  page: function (category_id) {
    //duplicate a part of "setCategory"
    var oldCategory = Session.get("category_id");
    if (oldCategory !== category_id) {
      Session.set("category_id", category_id);
    }
  },
  setCategory: function (category_id) {
    var path = $('#categoryMenu').data('path');

    // update session
    var oldCategory = Session.get("category_id");
    if (oldCategory !== category_id) {
      Session.set("category_id", category_id);
    }

    // change URL
    this.navigate(path + "/" + category_id, true);
  }
});

Router = new PostsRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});