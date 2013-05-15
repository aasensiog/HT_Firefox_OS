var saveOauthVerifier = function() {
    console.log('savingOauthVerifier');
	var verifier = $('input#oauth_verifier').val();
    if (verifier) {
        localStorage.setItem('oauth_verifier', verifier);
        getAccessToken().done(function() {
            alert('Verified');
            //TODO: go to Live page
            document.location.href ='#menu';
        }).fail(function() {
            alert('ERROR oauth verifier');
        });
    } else {
        alert('You must enter the authorization code');
    }
};

var step1 = function() {
	var authorizeA = $('#authorize');
	authorizeA.hide();
    console.log('step1');
    if (!localStorage.getItem('oauth_token')) {
        console.log(localStorage.getItem('oauth_token'));
        request_token().done(function() {
            step2();
        });
    } else {
        step2();
    }
};

var step2 = function() {
    console.log('step2');
    if (!localStorage.getItem('oauth_verifier')) {
        console.info(getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage.getItem('oauth_token'));
        authorizeA.attr('href',
            getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage.getItem('oauth_token'));
        authorizeA.show();
    } else {
        $('input#oauth_verifier').val(localStorage.getItem('oauth_verifier'));
    }
};