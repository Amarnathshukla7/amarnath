# Booking Journey Vue Compoents

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
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