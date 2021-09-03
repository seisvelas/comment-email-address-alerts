const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

/*
> There were [N] email addresses found in the above comment. Please:
>
> 1) click `three dots` -> `edit` to remove the email addresses
> 2) click `edited` in the comment header, and click on the previous revision of the comment
> 3) when viewing the old revision with an email in it, click `options` -> `delete this revision from history`
*/

try {
  const payload = github.context.payload;
  const comment = payload.comment ? payload.comment.body : payload.issue.body;
  console.log(`comment: ${comment}`)
  const exemptDomainsInput = core.getInput('exemptions')
  const exemptDomains = exemptDomainsInput.split(',');
  console.log(`Exempt domains: ${exemptDomains}`);
  let emails = comment ? comment.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) : null;
  if (exemptDomainsInput && emails) {
      emails = emails.filter(addr => !exemptDomains.some(domain => addr.endsWith(domain)))
  }

  console.log(`emails: ${emails}`)

  if (emails) {
    if (emails.length === 0) {
      emails = null;
    }
  }

  if (emails) {
    const repoToken = core.getInput('repo-token');

    const notice = "There were " + emails.length + " email addresses found in the above comment. Please:\n\n" +
          "1) Click `three dots` -> `edit` to remove the email addresses.\n" +
          "2) Click `edited` in the comment header, and click on the previous revision of the comment.\n" +
          "3) When viewing the old revision with an email in it, click `options` -> `delete this revision from history`.";

    // make comment
    const data = JSON.stringify({
      "body": notice
    })
      
    const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${payload.repository.full_name}/issues/${payload.issue.number}/comments`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${repoToken}`,
            "User-Agent": "Email Comment GitHub Action"
        }
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            process.stdout.write(d)
        })
    })
  
    req.on('error', error => {
        console.error(error)
    })
  
    req.write(data)
    req.end()

  } else {
    console.log("No emails found in comment");
  }

} catch (error) {
  core.setFailed(error.message);
}
