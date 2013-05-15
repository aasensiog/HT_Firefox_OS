var EvImages = {
	goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
	ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

var files = {
    teamDetails: {
        file: 'teamdetails',
        version:'2.8'
    },
    live:  {
        file: 'live',
        version: '1.8'
    },
    matches: {
        file: 'matches',
        version: '2.6'
    }
};

$(document).on('pageinit', '#index', function() {
    alert('1');
    if (!localStorage.getItem('ok_oauth_token')) {
        document.location.href = '#authentication';
    } else {
        console.log('tenemos el ok_access_token');
        console.log(localStorage.getItem('ok_oauth_token'));
        document.location.href = '#menu';
    }
});

$(document).on('pageinit', '#menu', function() {
    alert(2);
    $('body').html(localStorage['ok_oauth_token']);
    getData(files.teamDetails).done(function(resp) {
        alert(toJson(resp));
    }).fail(function() {
        alert('fail');
    });
});

$(document).on('pageinit', '#authentication', function() {
    alert(3);
    console.log('No tenemos el ok_access_token');
    console.log(localStorage.getItem('ok_oauth_token'));
    step1();
});
