const core = require('@actions/core');
const github = require('@actions/github');

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  const comment = payload.comment ? payload.comment.body : payload.issue.body;
  console.log(`The comment: ${comment}`);
  core.setOutput("emails", ""); // set emails here!
} catch (error) {
  core.setFailed(error.message);
}