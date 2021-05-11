const core = require('@actions/core');
const github = require('@actions/github');

try {
  const payload = github.context.payload;
  const comment = payload.comment ? payload.comment.body : payload.issue.body;
  const emails = comment.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
  core.setOutput("emails", emails.join(", ")); // set emails here!
} catch (error) {
  core.setFailed(error.message);
}