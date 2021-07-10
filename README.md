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

```
<RoomAndTransactionView
  check-in="YYYY-MM-DD"
  check-out="YYYY-MM-DD"
  code="BRI"
  booking-source="STC"
  stripe-key="stripeKey"
/>
```

Confirmation:

```
<ConfirmationView />
```

## Dev Notes

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

```
$ cd st-christophers
$ yarn upgrade @bbwmc/booking-journey-vue --latest
```

Always good practice to do this on a PR and check that the deploy preview works as expected.

## Development

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

### Translations/Locale

The translation mechanism implemented using [i18n](https://kazupon.github.io/vue-i18n/introduction.html) All the translations are available under src/locales/{lang}.json. Never update the translation files manually, all the
translations are pull from contentful service.

#### Finding missing translations
yarn i18n:report --type=missing

#### Finding unused translations
yarn i18n:report --type=unused


### Resources

- [Better Specs (Aggressively recommended)](https://www.betterspecs.org/)
- [Testing Library](https://testing-library.com/docs/vue-testing-library/intro)
- [jest-dom] - (https://github.com/testing-library/jest-dom#tobevisible)
