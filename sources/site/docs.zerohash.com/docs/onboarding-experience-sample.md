# Source: https://docs.zerohash.com/docs/onboarding-experience-sample

## 

Use Cases

- **Out-of-the-box KYC service:** zerohash embeds all compliance and regulatory requirements in the KYC flow so platforms can fully focus on acquiring new customers. Manual reviews are handled by the zerohash compliance team.
- **Sensitive data handling:** Sensitive customer information, like date of birth, address, SSN, and ID information are captured directly by zerohash so platforms do not need to custody that data.
- **Faster time to live:** KYC is a low-code option that ensures platforms get live quickly and require low maintenance throughout, as new or evolving onboarding requirements are inherently added to the experience.

## 

Key Features

- **Required data collection:** All information that must be verified is asked for. zerohash never requires more information than necessary.
- **Intelligent fallback options:** zerohash attempts to verify the customer with only required information. If results are inconclusive, we automatically request more information to increase potential for higher approval rates.
- **Customizable screens:** Update colors and fonts to match existing user experiences.

### 

Profile management

Users that start the flow using the `update-participant` JWT permission will have the option of viewing/updating their profile info by clicking on the `Access Profile` at the `Approved` page.

The Profile flow can also be directly invoked with no ties with the Onboarding flow, more details on how to do this can be found at the [Profile module page](https://docs.zerohash.com/reference/sdk-modules-profile)

## 

Implementation details

1. [Acquire an onboarding access token](https://docs.zerohash.com/reference-link/sdk-modules-user-onboarding-acquire-an-onboarding-access-token-copy)
2. Integration:
 1. NPM package available here: [https://www.npmjs.com/package/zh-web-sdk?activeTab=readme](https://www.npmjs.com/package/zh-web-sdk?activeTab=readme)
 2. [SDK modules](https://docs.zerohash.com/reference/sdk-modules-user-onboarding)
3. Subscribe to participant status webhooks: [Participant status updates](https://docs.zerohash.com/reference-link/participant-status-updates)

## 

Experience sample

**Embedded user agreements**

![](https://files.readme.io/0446736-Agreements.png)

**Information collection**

![](https://files.readme.io/ed80d3a-Basic_information__contact.png) ![](https://files.readme.io/454241c-Residence__citizenship_-_US.png)

**Document capture when required**

![](https://files.readme.io/1aa4994-Preparing1.png)

**Results shared**

![](https://files.readme.io/1de7af2-Approved.png)

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page