# Booking Journey Vue Compoents

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

## Usage

### Important note:

Any pages that use the pages or the components requires the cid query in requests.
The cid query parameter is used to differenciate between different booking journeys. The customer maybe have two windows open to compare or land on pages
that they shouldn't be on directly. An example snippet of code is included below to make sure the pages are protected.

Install the package (Read access documentation first)

```
$ yarn add @bbwmc/booking-journey-vue
```

Import the packages you need:

```
import { RoomAndTransactionView, ConfirmationView } from '@bbwmc/booking-journey-vue/dist/BookingComponents.common'
```

Use each as needed

RoomAndTransactionView:

```jsx
<RoomAndTransactionView
  check-in="YYYY-MM-DD"
  check-out="YYYY-MM-DD"
  code="BRI"
  booking-source="STC"
  stripe-key="stripeKey"
/>
```

```js
<script>
...
import cryptoRandomString from 'crypto-random-string'
import { get as idbGet } from 'idb-keyval'
...
const client = stcClient()

export default {
  beforeRouteEnter: async (to, from, next) => {
    /**
     * Checking if the query has the cart token as cid query parameter, if not
     * the visitor will be redirected to availability along with other query parameters and cid.
     */
    if (!to.query.cid) {
      return next({
        path: to.path,
        query: {
          cid: cryptoRandomString({ length: 30, type: 'url-safe' }),
          ...to.query
        }
      })
    }

    /**
     * Check if the booking was already made and redirecting the user back to availability page.
     */
    const reservationExists = await idbGet(`reservation.${to.query.cid}`)
    if (reservationExists) {
      return next({
        path: to.path.replace('payment', '') + 'availability'
      })
    }

    return next()
  },
  ....
```

Confirmation:

```jsx
<ConfirmationView />
```

The page must be protected against no cid.

```js
<script>
export default {
  beforeRouteEnter: (to, from, next) => {
    if (!to.query.cid) {
      return next({
        path: to.path.replace('confirmation', '') + 'availability'
      })
    }

    return next()
  }
}
</script>
```

Payment/Transaction:

```js
<script>
import { get as idbGet } from 'idb-keyval'
export default {
  beforeRouteEnter: async (to, from, next) => {
    /**
     * Checking if the query has the cart token as cid query parameter, if not
     * the visitor will be redirected to availability page of the hostel.
     */
    if (!to.query.cid) {
      return next({
        path: to.path.replace('payment', '') + 'availability'
      })
    }

    /**
     * Check if the booking was already made and redirecting the user back to availability page.
     */
    const reservationExists = await idbGet(`reservation.${to.query.cid}`)
    if (reservationExists) {
      return next({
        path: to.path.replace('payment', '') + 'availability'
      })
    }

    return next()
  },
  .....
```

## Dev Notes

### Env Setup

By default the api will use the production endpoints to use stage instead, update the following env key 

```
VUE_APP_ENV=local
```

or if you need custom urls set below envs

```
VUE_APP_SEARCH_SVC_URL=
VUE_APP_RESERVATION_SVC_URL=
```

### Test Payment Request Button

#### Install Ngrok

```
$ brew install ngrok
```

Signup for an account https://ngrok.com/

Run the auth command:

```
$ ngrok authtoken REPLACE_ME_WITH_REAL_TOKEN
```

Run the ngork command (replace 8080 if running the project on a different port)

```
$ ngrok http --host-header=rewrite 8080
```

## Authentication for the registry

To gain access to the registry follow the steps below.

First, create a Personal Access Token. Head to the link and select the following scopes. https://github.com/settings/tokens/new

![Scopes](https://github.com/bbwmc/booking-journey-vue/raw/master/Screenshot%202020-04-22%20at%2008.09.27.png)

Afterwards copy the token and do the below.

```bash
$ vi ~/.npmrc
```

Copy the below lines:

```
//npm.pkg.github.com/:_authToken=PUT_YOUR_TOKEN_HERE
@bbwmc:registry=https://npm.pkg.github.com/
```

Lastly login to the registry:

```
$ yarn login --registry=https://npm.pkg.github.com/
```

## Publish

To publish includes a few steps, first make sure you've followed the above steps for authentication.

```
$ yarn lint
$ yarn build:lib
$ yarn publish
```

## Upgrade package on website repos (stc, fp, agents, stc-network...)

Example for [st-christophers.co.uk](github.com/bbwmc/st-christophers.co.uk) adjust for other repos

```bash
$ cd st-christophers
$ yarn upgrade @bbwmc/booking-journey-vue --latest
```

Always good practice to do this on a PR and check that the deploy preview works as expected.

## Development

If you are planning to work on this package along with the dependent package, you follow the below commands:

In booking-journey-vue project run:

This will run the build continuesly if any changes are made it will build it much quicker then running the whole build again!

```bash
yarn build:lib --watch
```

This will package the library into a compressed tgz package.

```bash
yarn pack
```

In dependent project run after running yarn add with the path to the tgz file.

```
yarn add ../path/to/bbwmc-booking-journey-vue-vX.X.X.tgz
```

### Issues

- When you run yarn dev, if your nuxt client compiling is stuck for a while this is because the symlinked folder has node_modules folder, its trying to compile that too.

## Testing

This package uses both cypress.io and extended version of jest with (vue-test-utils, jsdom, testing-library). These packages are required, jest have some of the depricated functionalities that are super useful when testing. Due to this we are compeleting testing tool with testing-library.

### Run your unit tests

If you want to run your tests continuously add the --watch flag.

```

yarn test:unit

```

### Run your end-to-end tests

```

yarn test:e2e

```

### Lints and fixes files

```

yarn lint

```

### Resources

- [Better Specs (Aggressively recommended)](https://www.betterspecs.org/)
- [Testing Library](https://testing-library.com/docs/vue-testing-library/intro)
- [jest-dom] - (https://github.com/testing-library/jest-dom#tobevisible)

```

```
