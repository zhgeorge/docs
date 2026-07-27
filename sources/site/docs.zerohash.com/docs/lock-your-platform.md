# Source: https://docs.zerohash.com/docs/lock-your-platform

The **Locking** feature allows a platform to restrict customers from moving funds away from a platform without explicit approval by the platform. This might be useful for if, for example, the platform manages outstanding obligations manually or has discrete settlement times - and as a result dynamic and instant transfers & withdrawals might cause issues. It's worth noting that customers will have less flexibility when assets are locked.

## 

How it Works

### 

Turning on Locking

Platform locking is a configuration that can only be made by zerohash administrators. Please contact us at [support@zerohash.com](mailto:support@zerohash.com) if interested in enabling this feature.

### 

General Guidelines

- Customers cannot allocate funds away from a locked platform without approval from the platform.
- Customers cannot withdraw funds from a locked platform. They must first unallocate those funds, and then submit a withdrawal.
- The **Withdrawals** page, found under the **Platform** header offers platform operators the ability to review, approve and/or reject pending withdrawals.
- Email alerts are sent to both platforms and requesting participants whenever there are allocation & withdrawal requests made, for real-time notification.

### 

Lock & Unlock Workflows

#### 

Portal

- When a customer opts to allocate funds **to** a locked platform, those funds will remain locked. The user receives a warning before these types of allocations:

![](https://files.readme.io/9f83afd-image.png)

- When a customer opts to Allocate funds **from** a locked platform, the platform will have to approve the movement from the Portal. The user will be able to Approve or Reject a withdrawal and also view all Pending, Approved, and Rejected attempts.
- Accessible via the **Withdrawals** page, found under the **Platform** header:

![](https://files.readme.io/8199851-image.png) 

### 

API

If the user initiates a withdrawal from the locked platform via the `POST /withdrawals/requests` endpoint, the system will return the message, "Cannot withdraw directly from this account. Please un-allocate funds from this platform and then withdraw." API specs can be found [here](https://docs.zerohash.com/reference/post_withdrawals-requests).

### 

Email Alerts

All platforms and their customers will receive email notifications when certain actions take place:

#### 

Customer Perspective

- Allocation Transfer Pending
- Allocation Transfer Cancelled
- Allocation Transfer Processed
- Allocation Transfer Rejected

#### 

Platform Perspective

- Platform Withdrawal Request Pending
- Platform Withdrawal Request Cancelled
- Platform Withdrawal Request Processed
- Platform Withdrawal Request Rejected

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page