var EvImages = {
	goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
	ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

var saveUserToken = function() {
	var token = $('input#user_token').val();
	localStorage['userToken'] = token;
};

$(document).ready(function() {
  	// disable ajax nav
  	$.mobile.ajaxLinksEnabled = false;
});


$(document).on('load', '#page1', function(){
	$.ajax({
		url: "http://www.google.com",
		xhrFields: {
			withCredentials: true
		}
	})
	.done(function() {
		alert("done");
	}).fail(function() {
		alert("fail");
	});

});

$(document).on('pageinit', '#page2', function(){
    $('#match').text(localStorage['userToken']);
});