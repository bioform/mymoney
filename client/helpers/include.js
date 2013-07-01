/*///////////////////////

Adds support for passing arguments to partials. Arguments are merged with 
the context for rendering only (non destructive). Use `:token` syntax to 
replace parts of the template path. Tokens are replace in order.

USAGE: {{$ 'path.to.partial' context=newContext foo='bar' }}
USAGE: {{$ 'path.:1.:2' replaceOne replaceTwo foo='bar' }}

///////////////////////////////*/

Handlebars.registerHelper('$', function(partial) {

  if (!partial) console.error("No partial name given.")

  var values = Array.prototype.slice.call(arguments,1)
  var opts = values.pop()
  var done, value

  while (!done) {
    value = values.pop()
    if (value) partial = partial.replace(/:[^\.]+/, value)
    else done = true
  }

  partial = Template[partial]
  if (!partial) return ''

  var context = _.extend({}, opts.context||this, _.omit(opts, 'context', 'fn', 'inverse'))
  //console.log("=====>", JSON.stringify(context))
  return new Handlebars.SafeString( partial(context) )
})

Handlebars.registerHelper('today', function(){
  return moment().format('L');
});
