
var request_token_url = 'https://chpp.hattrick.org/oauth/request_token.ashx';
var authorize_path_url = 'https://chpp.hattrick.org/oauth/authorize.aspx';

var accessor = {
    token: 'DDWFtJRH1Lb1GNTC',
    tokenSecret: 'VD6vofdOCG795Lwq',
    consumerKey : "I7YbVQstMasUCioQvQE19K",
    consumerSecret: "Uc6kND7rrRdKj5JzAC1qbx2zdjMAxiq3mhPhjEpvvMN"
};

var access_token = '6U7A4AJRc1HZgshA';

var authorize_path = function() {
    var url = authorize_path_url;
    var message = {
      action: url,
      method: "GET",
      parameters: {

      }
    };

    OAuth.completeRequest(message, accessor);
    OAuth.SignatureMethod.sign(message, accessor);
    url = url + '?' + OAuth.formEncode(message.parameters);
    window.location.href = url;
};


var request_token = function() {
    var url = request_token_url;


    var message = {
      action: url,
      method: "GET",
      parameters: {
        oauth_callback: 'oob'
      }
    };

    OAuth.completeRequest(message, accessor);
    OAuth.SignatureMethod.sign(message, accessor);
    url = url + '?' + OAuth.formEncode(message.parameters);
    window.location.href = url;
    $.ajax({
        url: url,
        dataType: 'html',
        success: function(data)
        {
            console.info(data);
        },
        error: function(data) {
            console.error(data);
        }
    });
};
