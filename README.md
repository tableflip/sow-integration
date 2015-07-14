# School of Wok - Integration tests

Assemble:
- schoolofwok.co.uk
- sow-backoffice
- sow-api

1. Copy `config/default.json` to `config/runtime.json`.
2. Obtain the credentials for a SOW backoffice user and add to `config/runtime.json`.
3. For quick demo and testing

    ```sh
    # Run sow api, sow-backoffice, schoolofwok
    npm start

    # run all the things and start the integration tests
    npm test
    ```
