var customerName
, currentOrder ;

$( document ).ready(function() {
	$(".submit-name").click(function(){
		event.preventDefault();
		var savedName = $(".submit-name-text").val();

		if (savedName == "" || savedName.length < 0) {
			alert("Please enter a name");
			return;
		}

		customerName = savedName;
		$(".welcome-msg .name").text(savedName);
		$(".welcome-container").fadeOut(function(){
			$(".homepage-container").fadeIn().addClass("active-container");
		});
	});

	$('.hamburger').click(function(){
		$(".side-menu").slideToggle();
	});

	$(".side-menu a").click(function(){
		$(".side-menu").slideToggle();
	});

	$('body').on("click", ".click-trigger", function(e) {  
      $('.active-container').hide();
      var containerToOpen = '#' + $(this).data('open-container');
      e.preventDefault();
      $(containerToOpen).addClass("active-container");
      $(containerToOpen).show();
   		
   		if($(this).hasClass("place-order")){
			$(".progress-bar").show();
			$(".past-orders-container .current-order-panel").show();
		}

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

	$('body').on("click", ".submit-order", function(e) {  
       currentOrder = getOrder();
       setReview(currentOrder);
  	});

	$(".place-order").click(function() {
		currentOrder.name = customerName;
		currentOrder.status = "open";
		currentOrder.note = $("#special-instructions").val();

		Ignition.postOrder(currentOrder).then(function() {
			currentOrder = null;
		})
	})


  	buildCustomizationPanel();
});

function setReview(order) {
	for (key in order) {
		$("." + key + "-review").html('<p class="review-item ' + key + '-review">' + key + ": " + '<span>' + order[key].toString() + '</span></p>');
	}
}

function buildCustomizationPanel() {
	var missingIngredients = Ignition.getMissingIngredientList().then(function(data) {
		var missingList = (data.length > 0) ? data[0] : {};
		var availableList = getAvailableIngredientsList(missingList);
		console.log(availableList);
		buildCustomizationPanelHTML(availableList);
	});
}

function showTab(key) {
	$.each($(".list"), function() {
			$(this).hide();
		});
		$("#" + key + "-inventory").show();
}

function getAvailableIngredientsList(missingList) {
	var fullList = JSON.parse(JSON.stringify(Ignition.options));
	for (key in missingList) {
		if (missingList.hasOwnProperty(key) && key.indexOf("[]") > 0) {
			var choices = missingList[key];
			var normalKey = key.replace("[]", "");
			if (Array.isArray(choices)) {
				for (var i=0; i< choices.length; i++) {
					var idx = (fullList[normalKey]).indexOf(choices[i]);
					fullList[normalKey].splice(idx, 1);
				}
			} else {
				var idx = (fullList[normalKey]).indexOf(choices);
				fullList[normalKey].splice(idx, 1);
			}	
		}
	}
	return fullList;
}

function buildCustomizationPanelHTML(list) {
	var html = "";
	var options = list;
	console.log(list);
	for (key in options) {
		if (options.hasOwnProperty(key)){
			var lowerkey = key.toLowerCase();
			var additionalClass = (lowerkey == "flavors") ? " active-list" : "";
			html += '<ul class="list ' + lowerkey + additionalClass +'" id="' + lowerkey +'-list" data-id="' + key + '">';
			var choices = options[key];
			for (var i = 0; i < choices.length; i++) {
				var val = choices[i];
				html += "<li>" + '<input id="' + val + '" class="checkbox-custom" name="' + val + '" type="checkbox" value="' + val +'">' + 
				'<label for="' + val + '" class="checkbox-custom-label">' + val + '</label>' +
				"</li>";
			}
			if (lowerkey == "boosts") {
				html += '<li><button class="button click-trigger submit-order" data-open-container="review-container">Submit Order</button></li>';
			}
			html += "</ul>";
		}
	}
	$(".customization-panel").html(html);
}

function getOrder() {
	var order = {};
	$.each($(".list"), function(idx, element) {
		var key = $(element).data('id');
		var checked = $(element).find("li > input:checked");
		order[key] = [];
		for (var i=0; i < checked.length; i++){
			order[key].push(checked[i].value);
		}
	});
	return order;
}