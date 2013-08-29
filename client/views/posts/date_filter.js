var applayDateFilter = function(e){
      var input = e.currentTarget ? $(e.currentTarget) : e;

      Session.set( input.attr('id'), input.val() );
}

Template.dateFilter.rendered = function(){

  $.each(['#from_date', '#to_date'], function(index, value){
  	var field = $(value);
  	var id = field.attr('id');
  	field.val( Session.get(id) );
  	field.datepicker({format: datePickerFormat}).on('changeDate', applayDateFilter);
  });

}

Template.dateFilter.events({
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
