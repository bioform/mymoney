i18n.init({resGetPath: '/locales/__lng__/__ns__.json'}, function(t) {
  window.t = t; 

  Handlebars.registerHelper('t', function(key, hash){

    var params = {}; //default
    if(hash) params = hash.hash; 
    return window.t(key, params); 

  });

  $("[data-i18n]").i18n();

});