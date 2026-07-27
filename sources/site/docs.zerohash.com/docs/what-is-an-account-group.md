# Source: https://docs.zerohash.com/docs/what-is-an-account-group

An account group is a group of asset accounts used for a specific purpose. They are utilized to determine for which purpose the funds in the account have been allocated. Generally, an account group refers to a platform. For example, the group of accounts used in trading on the Zero Hash Liquidity Services platform will have an `account_group` value of `00SCXM`, which is the platform code for Zero Hash Liquidity Services. Similarly, you might have another group of accounts used for trading against a specific dealer, and they would therefore be marked with an `account_group` value of, for example, `ABC123`, where `ABC123` is the unique code that identifies the dealer's platform. A participant may be provided multiple account groups into which they can allocate funds for settling trades executed across many platforms.

With regard to a specific asset, account groups determine where your funds are allocated, i.e. you might have 100 BTC in total on zerohash, with 20 BTC allocated to the `00SCXM` account group and 80 allocated to the `ABC123` account group.

Account Groups can be best visualized on the Balances page of the [portal](https://portal.zerohash.com/). Here is an example from the perspective of a participant called "Zodiac Finance".

![](https://files.readme.io/595a507-image.png)

All account balances related to the OTC Desk 1 (AYQCKI) and Exchange 2 (O1FA74)) will be reflected by their respective rows. The balances associated with the **UNALLOCATED** Account Group are not assigned to any platform, and offer you the flexibility to allocate when and how you choose.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page