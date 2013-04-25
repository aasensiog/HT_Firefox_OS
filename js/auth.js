
var request_token_url = 'https://chpp.hattrick.org/oauth/request_token.ashx';

var request_token = function() {
    var url = request_token_url;
    var accessor = {
      //token: "...",
      //tokenSecret: "...",
      consumerKey : "I7YbVQstMasUCioQvQE19K",
      consumerSecret: "Uc6kND7rrRdKj5JzAC1qbx2zdjMAxiq3mhPhjEpvvMN"
    };

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

    $.ajax({
        url: url,
        dataType: 'html',
        success: function(data)
        {
            console.info(data);
        },
        error: function(data) {
            console.error(data);
        },
        complete: function(cs1) {
            console.info(cs1);
            if(cs1.readyState == 4 && cs1.status == 200) {
                console.info(cs1);
            };
        },
    });
};
