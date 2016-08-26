# School of Wok - Integration tests

Start up schoolofwok.co.uk, sow-backoffice, sow-api in `NODE_ENV=test` and run [nightwatch](http://nightwatchjs.org/) tests against them.

## Getting started

1. Copy `config/default.json` to `config/runtime.json`
2. Obtain the credentials for a SOW backoffice user and add to `config/runtime.json`
3. Run the tests:

    ```sh
    # Run sow api, sow-backoffice, schoolofwok and start the integration tests
    npm test
    ```

N.B. You can start up all the servers without running the tests using `npm start`

### Test specific suite

e.g.

```sh
NIGHTWATCH_TEST=test/nightwatch/book-class-promo.js npm test
```
