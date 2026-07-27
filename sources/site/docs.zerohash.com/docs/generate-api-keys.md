# Source: https://docs.zerohash.com/docs/generate-api-keys

## 

Key Generation and Approval

zerohash Platforms can create API keys themselves self-service via the [Client Portal](https://zerohash-group.readme.io/docs/onboarding). Depen

Once successfully logged in, navigate to **Administration → API Keys**:

![](https://files.readme.io/15986be-image.png)

Then find the **"Add API Key"** button in the top right of the screen:

![](https://files.readme.io/b6a58bf-image.png)

Assign the key a Nickname, Passphrase, an Expiration date, and optionally whitelist IP addresses the key can call the API from. **Note** that you'll need to contact a zerohash representative to have them manually [whitelist all needed IP addresses](https://zerohash-group.readme.io/docs/whitelist-ip-addresses). This is the **global whitelist**. On the Add API Key modal below, you can get more granular and provision various keys to be hit from certain IP addresses:

![](https://files.readme.io/a85c440-image.png)

Remember to securely record the public key, private key, and passphrase down as the private key and passphrase will only be presented to you once and will not be saved anywhere

**Approvals:** All newly created API key will be assigned a **Created** status. The API key is not live at this point. We require two additional approvals before a user can being calling the API with the new key:

![](https://files.readme.io/cda9e6a-image.png)

Once approved, ensure that you have contacted a zerohash representative in order to whitelist all needed IP addresses. once that's complete you can use the API key.

Updated 4 months ago

---

### What’s Next

Sample authentication snippets.

- [Code Snippets](https://zerohash.readme.io/v1.0/recipes/rest-api-authentication-1)

Did this page help you?

Yes

No

Copy Page