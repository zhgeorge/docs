# Source: https://docs.zerohash.com/docs/balances-websocket

The Balance Websocket is a real-time feed that sends an update to the client each time an account's balance is updated.

## 

Use Cases

- **Deposits:** Update dashboards or customer-facing UI's each time a crypto or fiat deposit is made.
- **Trade settlements:** Update dashboards or customer-facing UI's each time a trade has settled.
- **Withdrawals:** Update dashboards or customer-facing UI's each time a withdrawal has been initiated.
- **Ad-hoc:** The websocket can serve a variety of use cases and is a convenient alternative to constantly polling a rest endpoint.

## 

Key Features

- The client will establish an initial connection with the websocket that responds with a list of all current balances
- From there, just listen for balance-update messages
- The websocket will update for all `movement_types`

## 

API Reference

- [Balances Websocket](https://zerohash-group.readme.io/reference/private-websocket-api)

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page