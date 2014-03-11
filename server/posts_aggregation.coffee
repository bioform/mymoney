path = Npm.require('path')
Future = Npm.require('fibers/future')

#Post = new Meteor.Collection("posts")

Meteor.startup ->
  Post.aggregate = (pipeline) ->
    self = this
 
    future = new Future
    self.find()._mongo.db.createCollection(self._name, (err, collection) ->
      if err
        future.throw(err)
        return
 
      collection.aggregate(pipeline, (err, result) ->
        if err
          future.throw(err)
          return
 
        future.ret([true, result])
      )
    )
    
    result = future.wait()
    if !result[0]
      throw result[1]
 
    return result[1]
 
agg_amount = (userId, categoryId, fromDate, toDate) ->

  pipeline = []

  # Category Filter
  if categoryId and categoryId != 'all'
    pipeline.push 
      $project:
        _id : 0
        categoryId: 1
        year: 1
        month: 1
        createdAt: 1
        amount: 1
        userId: 1

    pipeline.push
      $match:
        categoryId: categoryId
        userId: userId

  else
    pipeline.push 
      $project:
        _id: 0
        year: 1
        month: 1
        createdAt: 1
        amount: 1
        userId: 1

    # filter by user
    pipeline.push
      $match:
        userId: userId

  # Date Filter
  if fromDate
    pipeline.push
      $match:
        createdAt: {$gte: fromDate}

  if toDate
    pipeline.push
      $match:
        createdAt: {$lt: toDate}

  # Group By
  if categoryId and categoryId != 'all'
    pipeline.push
      $group: 
        _id: {categoryId: "$categoryId", year: "$year", month: "$month"}
        sum:
          "$sum": "$amount"
  else
    pipeline.push
      $group: 
        _id: {year: "$year", month: "$month"}
        sum:
          "$sum": "$amount"

  pipeline.push 
    $project:
      _id: 0
      year: "$_id.year"
      month: "$_id.month"
      sum: 1 

  pipeline.push
    $sort:
      year: -1
      month: -1

 
  data = Post.aggregate(pipeline)
  #console.log("===!!!=====>", data)
  return data

Post.find({}).forEach (x) ->

  Post.update(x._id, {$set: {
    amount: parseInt(""+x.amount)
    year: x.createdAt.getFullYear()
    month: x.createdAt.getMonth()
  }})

 

Meteor.publish('sum_by_category', (categoryId) ->
  
  self = this
  userId = this.userId
  initializing = true
 
  handle = Post.find({categoryId: categoryId}).observeChanges(
    added: (id) ->
      if !initializing
        self.changed("post_stats", categoryId, agg_amount(userId, categoryId))
    changed: (id) ->
      self.changed("post_stats", categoryId, agg_amount(userId, categoryId))
  )
 
  initializing = false
  self.added("post_stats", categoryId, agg_amount(userId, categoryId))
  self.ready()
 
  self.onStop( ->
    handle.stop()
  )
)