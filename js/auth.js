
function getConsumerInfo() {
  var base_url = 'https://chpp.hattrick.org/oauth/';

  var consumer = {
    consumerKey: 'I7YbVQstMasUCioQvQE19K',
    consumerSecret: "Uc6kND7rrRdKj5JzAC1qbx2zdjMAxiq3mhPhjEpvvMN",

    serviceProvider: {
      method: 'GET',
      signatureMethod: 'HMAC-SHA1',
      request_token_url: base_url+'request_token.ashx',
      authorize_url: base_url+'authorize.aspx',
      authenticate_url: base_url+'authenticate.aspx',
      acces_token_url: base_url+'access_token.ashx',
      check_token_url: base_url+'access_token.ashx',
      invalidate_token_url: base_url+'check_token.ashx'
    }
  };

  return consumer;
}

var request_token = function() {
  var consumer = getConsumerInfo();

  var message = {
    action: consumer.serviceProvider.request_token_url,
    method: null, //consumer.serviceProvider.method,
    parameters: {
      oauth_callback: 'oob'
    }
  };
  var accessor = {
    consumerSecret: consumer.consumerSecret,
    consumerKey: consumer.consumerKey
  };

  OAuth.completeRequest(message, accessor);
  url = message.action + '?' + OAuth.formEncode(message.parameters);

  var crossDomainXHRDisplay = $("#cross-domain-xhr-display");
  var xhr = new XMLHttpRequest({
    mozSystem: true
  });
  xhr.open("GET", url, true);
  xhr.responseType = 'html';

  xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
          crossDomainXHRDisplay.html(xhr.response);
      }
  }
  xhr.onerror = function () {
      crossDomainXHRDisplay.html("<h4>Result from Cross-domain XHR</h4><p>Cross-domain XHR failed</p>");
  };

  xhr.send();

  /*
  $.ajax({
        method: 'GET',
        url: url,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("mozSystem", true);
        },
        error : function(req, err) {
          console.error(req.responseText);
          console.error(err);
        },
        success: function(data)
        {
          console.info(data);
        }
    });
    */
};

