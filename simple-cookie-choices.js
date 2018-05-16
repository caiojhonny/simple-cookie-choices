(function(window) {

  if (!!window.SimpleCookieChoices) {
    return window.SimpleCookieChoices;
  }

  var document = window.document;
  // IE8 does not support textContent, so we should fallback to innerText.
  var supportsTextContent = 'textContent' in document.body;

  var SimpleCookieChoices = (function() {

    var cookieName = 'cookieConsent';
    var cookieAcceptedName = 'cookieAccepted';
    var cookieConsentId = 'cookieChoiceInfo';
    var acceptBtnId = 'cookieChoiceAccept';
    var rejectBtnId = 'cookieChoiceReject';
    var isAccepted = false;

    function _onIsAcceptedStateChanged(value) {
      var evt = new CustomEvent('cookiechoicetatechanged', { detail: value });

      window.dispatchEvent(evt);
    }

    function _createHeaderElement(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle) {
      var butterBarStyles = 'position:fixed;width:100%;background-color:#232323;' +
          'margin:0;left:0;bottom:0;padding:20px;z-index:1000;text-align:center;font-size:1rem;color:#ffffff';

      var cookieConsentElement = document.createElement('div');
      cookieConsentElement.id = cookieConsentId;
      cookieConsentElement.className = cookieConsentId;
      cookieConsentElement.style.cssText = butterBarStyles;
      cookieConsentElement.appendChild(_createConsentText(cookieText));

      if (!!linkText && !!linkHref) {
        cookieConsentElement.appendChild(_createInformationLink(linkText, linkHref));
      }

      var groupBtn = document.createElement('div');
      groupBtn.style.display = 'block';
      groupBtn.style.textAlign = 'center';
      groupBtn.style.margin = '10px 0 0';

      groupBtn.appendChild(_createAcceptBtn(acceptBtnTitle));
      groupBtn.appendChild(_createRejectBtn(rejectBtnTitle));

      cookieConsentElement.appendChild(groupBtn);
      return cookieConsentElement;
    }

    function _createDialogElement(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle) {
      var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
          'top:0;left:0;opacity:0.5;filter:alpha(opacity=50);' +
          'background-color:#ccc;';
      var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
      var contentStyle = 'position:relative;left:-50%;margin-top:-25%;' +
          'background-color:#fff;padding:20px;box-shadow:4px 4px 25px #888;';

      var cookieConsentElement = document.createElement('div');
      cookieConsentElement.id = cookieConsentId;

      var glassPanel = document.createElement('div');
      glassPanel.style.cssText = glassStyle;

      var content = document.createElement('div');
      content.style.cssText = contentStyle;

      var dialog = document.createElement('div');
      dialog.style.cssText = dialogStyle;

      var acceptLink = _createAcceptBtn(acceptBtnTitle);
      acceptLink.style.display = 'inline-block';
      acceptLink.style.marginTop = '8px';

      var rejectLink = _createRejectBtn(rejectBtnTitle);
      rejectLink.style.display = 'inline-block';
      rejectLink.style.marginTop = '8px';

      content.appendChild(_createConsentText(cookieText));
      if (!!linkText && !!linkHref) {
        content.appendChild(_createInformationLink(linkText, linkHref));
      }

      var groupBtn = document.createElement('div');
      groupBtn.style.display = 'block';
      groupBtn.style.textAlign = 'right';
      groupBtn.style.marginTop = '20px';

      groupBtn.appendChild(acceptLink);
      groupBtn.appendChild(rejectLink);

      content.appendChild(groupBtn);
      dialog.appendChild(content);
      cookieConsentElement.appendChild(glassPanel);
      cookieConsentElement.appendChild(dialog);
      return cookieConsentElement;
    }

    function _setElementText(element, text) {
      if (supportsTextContent) {
        element.textContent = text;
      } else {
        element.innerText = text;
      }
    }

    function _createConsentText(cookieText) {
      var consentText = document.createElement('span');
      _setElementText(consentText, cookieText);
      return consentText;
    }

    function _createAcceptBtn(acceptBtnTitle) {
      var acceptBtn = document.createElement('button');
      _setElementText(acceptBtn, acceptBtnTitle);
      acceptBtn.id = acceptBtnId;
      acceptBtn.className = 'btn btn-primary';
      acceptBtn.type = 'button';
      acceptBtn.style.margin = '5px';
      return acceptBtn;
    }

    function _createRejectBtn(rejectBtnTitle) {
      var rejectBtn = document.createElement('button');
      _setElementText(rejectBtn, rejectBtnTitle);
      rejectBtn.id = rejectBtnId;
      rejectBtn.className = 'btn btn-danger';
      rejectBtn.type = 'button';
      rejectBtn.style.margin = '5px';
      return rejectBtn;
    }

    function _createInformationLink(linkText, linkHref) {
      var infoLink = document.createElement('a');
      _setElementText(infoLink, ' '+linkText);
      infoLink.href = linkHref;
      infoLink.display = 'inline-block';
      return infoLink;
    }

    function setAccept() {
      _saveUserPreference(true);
      _removeCookieConsent();
      return false;
    }

    function setReject() {
      _saveUserPreference(false);
      _removeCookieConsent();
      return false;
    }

    function _showCookieConsent(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle, isDialog) {
      if (_shouldDisplayConsent()) {
        _removeCookieConsent();
        var consentElement = (isDialog) ?
            _createDialogElement(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle) :
            _createHeaderElement(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle);
        var fragment = document.createDocumentFragment();
        fragment.appendChild(consentElement);
        document.body.appendChild(fragment.cloneNode(true));
        document.getElementById(acceptBtnId).onclick = setAccept;
        document.getElementById(rejectBtnId).onclick = setReject;
      }
    }

    function showCookieConsentBar(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle) {
      _showCookieConsent(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle, false);
    }

    function showCookieConsentDialog(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle) {
      _showCookieConsent(cookieText, linkText, linkHref, acceptBtnTitle, rejectBtnTitle, true);
    }

    function _removeCookieConsent() {
      var cookieChoiceElement = document.getElementById(cookieConsentId);
      if (cookieChoiceElement != null) {
        cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
      }
    }

    function _saveUserPreference(accepted) {
      // Set value true or false
      isAccepted = accepted;
      _onIsAcceptedStateChanged(isAccepted)
      // Set the cookie expiry to one year after today.
      var expiryDate = new Date(new Date() * 1 + 365 * 864e+5);
      document.cookie = cookieName + '=y; expires=' + expiryDate.toUTCString() + '; path=/';
      document.cookie = cookieAcceptedName + '='+isAccepted+'; expires=' + expiryDate.toUTCString() + '; path=/';
    }

    function eraseCookies() {   
      document.cookie = cookieName + '=y;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      document.cookie = cookieAcceptedName + '=false;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      document.cookie = cookieAcceptedName + '=true;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      _onIsAcceptedStateChanged(null);
    }

    function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    }

    function consentAccepted(){
      var isAccepted = getCookie(cookieAcceptedName);
      if(isAccepted == 'true'){
        return true;
      }else if(isAccepted == 'false'){
        return false;
      }else{
        return isAccepted;
      }
    }

    function _shouldDisplayConsent() {
      // Display the header only if the cookie has not been set.
      return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
    }

    var exports = {};
    exports.eraseCookies = eraseCookies;
    exports.consentAccepted = consentAccepted;
    exports.showCookieConsentBar = showCookieConsentBar;
    exports.showCookieConsentDialog = showCookieConsentDialog;
    exports.setAccept = setAccept;
    exports.setReject = setReject;
    return exports;
  })();

  window.SimpleCookieChoices = SimpleCookieChoices;
  return SimpleCookieChoices;
})(this);