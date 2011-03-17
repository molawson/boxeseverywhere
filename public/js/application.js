jQuery.ajaxSetup({ 
	"beforeSend": function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")} 
})

function _ajax_request(url, data, callback, type, method) {
    if (jQuery.isFunction(data)) {
        callback = data;
        data = {};
    }
    return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
        });
}

jQuery.extend({
	put: function(url, data, callback, type) {
	  return _ajax_request(url, data, callback, type, 'PUT');
	},
	delete_: function(url, data, callback, type) {
	  return _ajax_request(url, data, callback, type, 'DELETE');
	}
});

$(document).ready(function() {
  
  $(".pop_target").live("touchstart", function(e) {
		e.preventDefault();
		$(".popover").hide();
    $(this).siblings(".popover").show();
  });

  $("#content").live("touchend", function(e) {
		e.preventDefault();
    if (!$(e.target).hasClass("pop_target") && !$(e.target).hasClass("popover") && !$(e.target).parent().hasClass("popover")) {
			$(".popover").hide();
		}
  });

	$(".popover a.delete").live("touchstart", function(e) {
		e.preventDefault();
		var really = confirm("Are you sure you want to delete this item?");
		var parent = $(this).parents("li.has_popover");
		if (really) {
			$.delete_($(this).attr("href"), $(this).serialize(), function(data) {
				if (data) {
					parent.remove();					
				} else {
					parent.children(".popover").hide();
					alert("There was a problem deleting that item. Let us know if the problem continues.");
				}
			});
		} else {
			parent.children(".popover").hide();
		}
		return false;
	})
  
  $("a.get").live("touchstart", function(e) {
		e.preventDefault();
		$(this).addClass("pressed");
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