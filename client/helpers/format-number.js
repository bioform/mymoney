Handlebars.registerHelper('formatNumber', function(str) {
  return new Handlebars.SafeString(accounting.formatNumber(parseInt(str)));
});
