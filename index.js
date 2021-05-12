const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

try {
  const payload = github.context.payload;
  const comment = payload.comment ? payload.comment.body : payload.issue.body;
  console.log(`comment: ${comment}`)
  const emails = comment.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
  console.log(`emails: ${emails}`)
  const prelude = "The following email addresses were found in the previous comment: ";
  const epilogue = "\r\n\r\nPlease delete this comment from the issue once the addresses have been removed.";

  if (emails) {
    const repoToken = core.getInput('repo-token');
    const output = prelude + emails.join(", ") + epilogue;
    // make comment
    const data = JSON.stringify({
        "body": output
      })
      
    const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${github.repository}/issues/${github.event.issue.number}/comments`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": repoToken
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