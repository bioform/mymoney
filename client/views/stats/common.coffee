PostStats = new Meteor.Collection("post_stats")

postStatsHandle = null

# Always be subscribed to the posts for the selected category.
Deps.autorun ->

  categoryId = Session.get('category_id');

  postStatsHandle = Meteor.subscribe('sum_by_category', categoryId || 'all')
 
Template.commonStats.stats = ->
  rows = []
  for own k,v of PostStats.find().fetch()[0]
    
    if k isnt '_id'
      v.monthName = moment(new Date(v.year, v.month, 1)).format("MMMM")
      rows.push(v)

  return rows


updateYearSections = ->

  #delete old recods
  $('.date-label').remove()

  date = null
  $(".post").each ->
    post = $(this)
    val = post.data("year")
    if val && val != date
      date = val
      post.before('<p class="date-label label label-info">' + date + '</p>')


Template.commonStats.rendered = ->
  updateYearSections()
