# Source: https://docs.zerohash.com/docs/single-sign-on-sso

SSO (Single Sign On) is available for use in Portal. SSO is optional but strongly encouraged as it provides enhanced security, risk reduction, and enterprise control.

Supported SSO technologies are OpenID (preferred) and SAML.

## 

Configuration

To configure SSO, please reach out to your zerohash Relationship Manager and provide the following information:

- The name of your identity provider (Okta, Azure/Entra ID, Google Workspace, etc)
- OpenID Connect Discovery URL
- OpenID Connect - Client ID
- OpenID Connect - Secret
- Email domain

## 

Expected Behaviors

1. When SSO is enabled, it will be enforced for all users on the same email domain. Partial SSO is not supported.
2. User auto-creation (SCIM provisioning) is not supported at this time. Follow the steps [here](https://docs.zerohash.com/docs/how-to-add-user) to invite a new user to join the participant account. The new user can then log in with their SSO credentials.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page