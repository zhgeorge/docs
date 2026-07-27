# Source: https://docs.zerohash.com/reference/get_time

⚠️

This reference guide is currently experiencing difficulties and will be back online shortly.

`ERR-YR5GEB`

# 

200

Current server time as a Unix epoch in seconds.

object

epoch

number

Current server time as a Unix timestamp in seconds.

# 

400

Bad Request

# 

403

Forbidden

# 

404

Not Found

# 

500

Internal Server Error

# 

503

Service Unavailable

Updated about 2 months ago

---

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

```
xxxxxxxxxx
1
curl --request GET \
2
     --url https://api.cert.zerohash.com/time \
3
     --header 'accept: application/json'
```

```
xxxxxxxxxx
 
1
{
2
  "epoch": 1550174574
3
}
```

Updated about 2 months ago

---

Did this page help you?

Yes

No