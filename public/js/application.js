jQuery.ajaxSetup({ 
	"beforeSend": function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")} 
})

$(document).ready(function() {
  
  $("a.get").live("click", function() {
    $.get($(this).attr("href"), $(this).serialize(), function (data) {
      $("#main").html(data);
    });
    return false;
  });
  
  $("input#search").live("keyup", function() {
    var theForm = $(this).parents("form#search_form");
    $.post(theForm.attr("action"), theForm.serialize(), function(data) {
      $("#list_of_stuff").html(data);
    });
  });
  
  $("#new_item").live("submit", function() {
    $.post($(this).attr("action"), $(this).serialize(), function(data) {
      $("#list_of_stuff").html(data);
      $("#new_item").each(function(){
        this.reset();
      });;
    });
    return false;
  });
  
});