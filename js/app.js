var EvImages = {
	goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
	ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

var urls = {
    teamDetails: '?file=teamdetails&version=2.8'
}

var saveOauthVerifier = function() {
    console.log('savingOauthVerifier');
	var verifier = $('input#oauth_verifier').val();
    if (verifier) {
        localStorage['oauth_verifier'] = verifier;
        getAccessToken().done(function() {
            alert('verified');
            //TODO: go to Live page
            document.location.href('#page_live');
        }).fail(function() {
            alert('ERROR oauth verifier');
        });
    } else {
        alert('You must enter the authorization code');
    }
};

$(document).ready(function() {
    // disable ajax nav
    //$.mobile.ajaxLinksEnabled = false;

});


$(document).on('pageinit', '#page_home', function() {
    //localStorage.clear();
	var authorizeA = $('#authorize');
	authorizeA.hide();

    var step1 = function() {
        console.log('step1');
        if (!localStorage['oauth_token']) {
            console.log(localStorage['oauth_token']);
            request_token().done(function() {
                step2();
            });
        } else {
            step2();
        }
    };

    var step2 = function() {
        console.log('step2');
        if (!localStorage['oauth_verifier']) {
            console.info(getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage.getItem('oauth_token'));
            authorizeA.attr('href',
                getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage.getItem('oauth_token'));
            authorizeA.show();
        } else {
            $('input#oauth_verifier').val(localStorage['oauth_verifier']);
        }
    };

    if (!localStorage['ok_oauth_token']) {
        console.log(localStorage['ok']);
        step1();
    } else {
        document.location.href = '#page_live';
    }
});

var buildMatch = function() {
    if (!response) return null;

    return '2'+' '+'no-suelo'+' : '+'opponent team'+' '+'1';
};

$(document).on('pageinit', '#page_live', function() {
    $('#match').html(localStorage['ok']);
    //doCall();
});
