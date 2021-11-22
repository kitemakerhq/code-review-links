# code-review-links
A simple script for attaching links to code review requests with the Kitemaker API

## Usage

Use the `add-link` script to add a link to a code review request

```bash
yarn
export KITEMAKER_TOKEN=<your-kitemaker-api-token>
yarn add-link --request=<code-review-request-link> --name=<link-name> --url=<link-url>
```

Use the `swap` script to replace a particular label with another one

Options:

- `--request`: The URL of the GitHub pull request or GitLab merge request
- `--name`: Whatever you'd like to call the external link (e.g. "staging link")
- `--url` The URL to link to

```bash
yarn
export KITEMAKER_TOKEN=<your-kitemaker-api-token>
yarn add-link --request=https://github.com/myorg/someproject/pull/123 --name="Staging environment" --url="https://staging.example.org/myproject/123"
```
