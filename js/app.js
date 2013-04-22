var EvImages = {
	goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
	ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

$(document).ready(function() {
  	// disable ajax nav
  	$.mobile.ajaxLinksEnabled = false;
});

var saveUserToken = function() {
	var token = $('input#user_token').val();
	localStorage['userToken'] = token;
};

$(document).on('pageinit', '#page1', function(){

});

$(document).on('pageinit', '#page2', function(){
    $('#match').text(localStorage['userToken']);
});