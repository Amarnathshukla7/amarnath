# Booking Journey Vue Compoents

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Run your unit tests
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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

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

-- Image Here --

Afterwards copy the token and do the below.

```bash
$ vi ~/.npmrc
```

Copy the below line:

```
//npm.pkg.github.com/:_authToken=PUT_YOUR_TOKEN_HERE
```

Lastly login to the registry:

```
$ yarn login --registry=https://npm.pkg.github.com/
```

## Publish


To publish includes a few steps, first make sure you've followed the above steps for authentication.

__Remeber:__ Update the pkg version in the `package.json` file.

```
$ yarn lint
$ yarn build:lib
$ yarn publish
```
