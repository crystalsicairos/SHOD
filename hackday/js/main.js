$( document ).ready(function() {
	$(".submit-name").click(function(){
		event.preventDefault();
		var savedName = $(".submit-name-text").val();
		$(".welcome-msg .name").text(savedName);
		$(".welcome-container").fadeOut(function(){
			$(".homepage-container").fadeIn().addClass("active-container");
		});
	});






	$('body').on("click", ".click-trigger", function(e) {  
      $('.active-container').hide();
      var containerToOpen = '#' + $(this).data('open-container');
      e.preventDefault();
      $(containerToOpen).addClass("active-container");
      $(containerToOpen).show();
      
  });

	$('body').on("click", ".customization-tabs a", function(e) {  
      $('.active-list').hide();
       $(".customization-tabs .active").removeClass("active");
      var panelToOpen = '#' + $(this).data('open-custom');
      e.preventDefault();
      $(panelToOpen).addClass("active-list");
      $(panelToOpen).show();
      $(this).addClass("active");
      
  });


});