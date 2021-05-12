'use strict';

var core = require('@actions/core');
var github = require('@actions/github');
var https = require('https');

/*
> There were [N] email addresses found in the above comment. Please:
>
> 1) click `three dots` -> `edit` to remove the email addresses
> 2) click `edited` in the comment header, and click on the previous revision of the comment
> 3) when viewing the old revision with an email in it, click `options` -> `delete this revision from history`
*/

try {
  var payload = github.context.payload;
  var comment = payload.comment ? payload.comment.body : payload.issue.body;
  console.log('comment: ' + comment);
  var emails = comment.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  console.log('emails: ' + emails);

  if (emails) {
    var repoToken = core.getInput('repo-token');
    var output = ('\n    There were ' + emails.length + ' email addresses found in the above comment. Please:\n\n    1) click `three dots` -> `edit` to remove the email addresses\n    2) click `edited` in the comment header, and click on the previous revision of the comment\n    3) when viewing the old revision with an email in it, click `options` -> `delete this revision from history`\n    ').replaceAll('    ', '');

    // make comment
    var data = JSON.stringify({
      "body": output
    });

    var options = {
      hostname: 'api.github.com',
      port: 443,
      path: '/repos/' + payload.repository.full_name + '/issues/' + payload.issue.number + '/comments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + repoToken,
        "User-Agent": "Email Comment GitHub Action"
      }
    };

    var req = https.request(options, function (res) {
      console.log('statusCode: ' + res.statusCode);

      res.on('data', function (d) {
        process.stdout.write(d);
      });
    });

    req.on('error', function (error) {
      console.error(error);
    });

    req.write(data);
    req.end();
  } else {
    console.log("No emails found in comment");
  }
} catch (error) {
  core.setFailed(error.message);
}