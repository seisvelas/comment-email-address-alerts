This GitHub Action monitors all new issues and comments for email addresses. If it detects one, it leaves a comment in the same issue noting the email addresses.

To use it, just add this code to the file `.github/workflows/main.yml`:

```yaml
on:
  issue_comment:
    types: [created, edited]
  issues:
    types: [opened, edited]
jobs:
  find_emails:
    runs-on: ubuntu-latest
    name: Check for emails in issue comments
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Scan comment
      id: scan
      uses: actions/comment-email-address-alerts@v2 # Uses an action in the root directory
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
```

That's it!
