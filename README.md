# Money Talks

Configure your email alias to forward tiplinks with desired value.

## Requirements

* A domain
* Cloudflare account
* npm or yarn (I reccomend yarn)
* node js

## Setting up
If your domain isn't yet hosted by Cloudflare, make and acount and start hosting your domain there.

Add email routing to your domain by following [the official cloudflare guide](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/) to set it up.

Head to the Email Workers tab in the Email Routing section and create an Email Worker.

Then head to the Routes tab to change the routing of your custom address to the newly created Email worker.

You can either follow Wranglers instructions and replace your repo's package.json and index.ts with this one's  

```
npm install / yarn add wrangler

wrangler login

wrangler init --from-dash WORKERNAME

wrangler deploy

```

or if you've cloned this repo


```
npm install / yarn add wrangler

wrangler login

wrangler deploy SCRIPT --name WORKERNAME


```
