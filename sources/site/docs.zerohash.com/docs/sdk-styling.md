# Source: https://docs.zerohash.com/docs/sdk-styling

# 

Customization

> ❗️
> 
> ### 
> 
> ADA and EAA Compliance
> 
> The Americans with Disabilities Act (and European Accessibility Act) has guidelines on the contrasts that need to be displayed on the UI of a website and an application in order to be compliant with the regulations.
> 
> 👉 **zerohash** team can provide recommendations on these color choices to ensure your SDK flow complies with these standards.

# 

Light and Dark Mode

### 

Context

zerohash supports both light and dark mode within our SDK's. Here is how it works:

- By default, SDK's are rendered in **Light Mode**
- Platforms have the following setting options:

| Setting Option | Description |
| --- | --- |
| `light` | Light Mode |
| `dark` | Dark Mode |
| `auto` | The end user's device settings will dictate whether `light` or `dark` is displayed |

### 

Technical implementation

To deviate from the default Light Mode setting, add the `theme` property and set it to the value of your choice (`light` , `dark` or `auto` )

Example code snippet:

JavaScript

```
import React, { useMemo } from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  // Create SDK instance once - not on every render
  const sdk = useMemo(() => new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.zerohash.com"
  }), []);

  const handleOpenFund = () => {
    sdk.openModal({
      appIdentifier: AppIdentifier.FUND,
      jwt: "<JWT_TOKEN_HERE>",
      theme: "auto", // default: "light"
    });
  };

  return (
    <button onClick={handleOpenCryptoBuy}>
      Stablecoin Deposit
    </button>
  );
};

export default App;
```

For more information on how to get started with our sdk's, see our SDK [Getting Started](https://docs.zerohash.com/reference/sdk-getting-started) page.

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page