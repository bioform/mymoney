Handlebars.registerHelper('navLink', function(page, text) {
  var ret = "<li ";
  if (Meteor.Router.page() == page) {
    ret += "class='active'";
  }
  ret += "><a href='" + Meteor.Router.namedRoutes[page].path + "'>" + t(text) + "</a></li>";
  return new Handlebars.SafeString(ret);
});