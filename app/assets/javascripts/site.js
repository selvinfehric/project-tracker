/**
 * General site UI
 */

var APP = APP || {};

APP.Site = {};

APP.Site.init = function () {
	this.addEvents();
}

APP.Site.addEvents = function () {
	
	$("#f-n-icon").click(function () {
		var $text = $("#f-n-text");
		
		if ($text.width() > 1) {
			$text.stop().animate( {width : 0}, 1000 );
		} else {
			$text.stop().animate( {width : 840}, 1000 );
		}
	});	
}

$(document).ready(function () {
	APP.Site.init();
});
