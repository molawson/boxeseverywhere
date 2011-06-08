jQuery.ajaxSetup({ 
	"beforeSend": function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")} 
})

$.fn.extend({
  // use touch events to simulate clicks (much more responsive)
  quickClick: function(callback) {
    this.live('touchstart', function(e) {
  	  moved = false;
  	  $(this).addClass('pressed');
  		$(this).bind('touchmove', function() {
  		  moved = true;
    	  $(this).removeClass('pressed');
  		});
  		$(this).bind('touchend', function(e) {
  		  e.preventDefault();
  		  $(this).unbind('touchend');
  		  $(this).unbind('touchmove');
    	  $(this).removeClass('pressed');
  		  if (!moved) {
  		    callback($(this));
  		  }
  		});
  	});
  } // end quickClick

});

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
  
  // show popovers
  $(".pop_target").live("touchstart", function(e) {
		e.preventDefault();
		$(".popover").hide();
    $(this).siblings(".popover").show();
  });
  
  // clear popovers when touching elsewhere
  $("#content").live("touchend", function(e) {
		e.preventDefault();
    if (!$(e.target).hasClass("pop_target") && !$(e.target).hasClass("popover") && !$(e.target).parent().hasClass("popover")) {
			$(".popover").hide();
		}
  });
	
	// delete items via popover
	$(".popover span.delete").quickClick(function(target) {
		var really = confirm("Are you sure you want to delete this item?");
		var parent = target.parents("li.has_popover");
		if (really) {
			$.delete_(target.data('location'), target.serialize(), function(data) {
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
  
  $('.get').quickClick(function(target) {
    $.get(target.data('location'), null, function(data) {
      $('#main').html(data);
    });    
  });
  
  // live search
  $("input#search").live("keyup", function() {
    var theForm = $(this).parents("form#search_form");
    $.post(theForm.attr("action"), theForm.serialize(), function(data) {
      $("#list_of_stuff").html(data);
    });
  });
  
  // create items
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