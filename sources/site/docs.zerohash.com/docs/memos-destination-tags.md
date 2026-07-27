# Source: https://docs.zerohash.com/docs/memos-destination-tags

## 

What is a memo, destination tag or message?

A memo or destination tag is an additional feature used by tag-based assets to further identify the recipient beyond the wallet address. For example, an exchange may require a memo, destination tag or message when you are sending it to them.

_For deposits of tag-based assets to zerohash, the memo, destination tag or message is required. This rule ALSO applies to any token that uses that base chain such as a USDC asset on a tag or memo based blockchain._

## 

Tagged based asset

| Name | Asset | Data Type | Type | Required on deposits? | Required on withdrawals? |
| --- | --- | --- | --- | --- | --- |
| EOS | EOS | Numeric | Memo | Yes | Optional |
| Stellar | XLM | Alpha-numeric | Memo | Yes | Optional |
| Ripple | XRP | Numeric | Destination Tag | Yes | Optional |
| Hedera | HBAR | Numeric | Memo | Yes | Optional |
| Algorand | ALGO | Alpha-numeric | Memo | Yes | Optional |
| Canton | CC | Numeric | Memo | Yes | Optional |
| Cosmos | ATOM | Numeric | Memo | Yes | Optional |
| Celestia | TIA | Alpha-numeric | Memo | Yes | Optional |
| Toncoin | TON | Alpha-numeric | Memo | Yes | Optional |

For more details on these assets, you can check the [Supported Assets & Instruments](https://docs.zerohash.com/docs/supported-assets-instruments) page.

## 

When do you need to provide a memos, destination tags and messages?

For some non-custodial wallet providers or externally-owned wallets, a memo / destination tag / message is optional when you withdraw assets. It is always recommended to check and verify this with your wallet provider first.

If a memo / destination tag / message is needed, please make sure you enter the correct information where needed, as incorrect information could lead to loss of funds. To be even safer, you can always test with a small amount to be sure that your transaction goes through.

## 

How a memos, destination tags and messages looks like on requests?

If you run [GET /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/get_deposits-digital-asset-addresses) endpoint on any of memo/destination/message tagged based assets in the above list, you will see the below response:

![](https://files.readme.io/52c6e9a-image.png)

The memo/destination tag id would be displayed after your address, and this is the id you need to use when submitting withdrawals, more details on withdrawals, see the below section for details.

## 

How to provide a memo, destination tag or message when withdrawing funds in zerohash

1. Withdrawal account creation via the client portal.

 1. When you create a new withdrawal address for the above asset using the client portal, you will be asked to enter either Memo ID or Destination Tag on the screen:

![](https://files.readme.io/0abc1bf-image.png) ![](https://files.readme.io/0591b8d-image.png) 

## 

Create a Withdrawal request via API.

1. When using request [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) endpoint with a defined withdrawal address, two related request parameters need to be used to provide the additional information for those assets:

| Parameter Name | Description | How to Use It |
| --- | --- | --- |
| `no_destination_tag` | It is a Boolean field to show whether or not the specific withdrawal and destination address requires a destination tag or memo ID. | If not required, please set this field to be true; otherwise false |
| `destination_tag` | The destination tag or memo ID associated with the transaction. | If `no_destination_tag` is false, then this field needs to be populated with the correct memo id or destination tag.<br>If `no_destination_tag` is true, this field is not required. |

For more details regarding this endpoint, please check the withdrawal section of our API documentation.

- [Deposits](https://docs.zerohash.com/reference/deposits)
- [Withdrawals](https://docs.zerohash.com/reference/withdrawals)
- [Convert and Withdraw](https://docs.zerohash.com/reference/convert-and-withdraw)

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page