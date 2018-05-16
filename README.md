# Simple Cookie Choices
> Javascript only. Just 3kb gzipped.

This plugin helps you to create a banner or dialog box for accepting or denying the terms based on the [GDPR](https://www.eugdpr.org/) rules.

## Demo

[Consent Bar](https://simple-cookie-choices.caiojhonny.com/)

[Consent Dialog](https://simple-cookie-choices.caiojhonny.com/dialog.html)


## Setup

Include the script into your site

```html
<script src="simple-cookie-choices.min.js"></script>
```

## Usage

If you want a Consent Bar, using this for init:

```html
SimpleCookieChoices.showCookieConsentBar('This site uses cookies to offer you a better browsing expirience.', 'Find out more on how we use cookies and how you can change your settings', '/cookie-policy.html', 'I accept cookies', 'I refuse cookies');
```

If you want a Dialog Bar, using this for init:

```html
SimpleCookieChoices.showCookieConsentDialog('This site uses cookies to offer you a better browsing expirience.', 'Find out more on how we use cookies and how you can change your settings', '/cookie-policy.html', 'I accept cookies', 'I refuse cookies');
```

## Params

```cookieText``` Brief descriptive text about your privacy policy

```linkText```(optional) Short text with link. It can be linked to your privacy page.

```linkHref```(optional) Link to your linkText

```acceptBtnTitle``` Title from your accept button

```rejectBtnTitle``` Title from your reject button

## Functions

```SimpleCookieChoices.consentAccepted()```(boolean) Returns if consensus was accepted 

```SimpleCookieChoices.setAccept()``` Action to accept the terms

```SimpleCookieChoices.setReject()``` Action to reject the terms

```SimpleCookieChoices.eraseCookies()``` Clear the plugin cookies

```SimpleCookieChoices.showCookieConsentBar()``` To init a Consent Bar

```SimpleCookieChoices.showCookieConsentDialog()``` To init a Dialog Bar


## Events

You can tell if the user has changed the option with the event ```cookiechoicetatechanged```

```
window.addEventListener('cookiechoicetatechanged', function (e) {
  console.log('Choice state changed', e.detail);
});
```

## License

MIT | [@caiojhonny](https://github.com/caiojhonny/)

\[[top](#simple-cookie-choices)\]
