const core = require('@actions/core');
const github = require('@actions/github');

try {
  const payload = github.context.payload;
  const comment = payload.comment ? payload.comment.body : payload.issue.body;
  console.log(`comment: ${comment}`)
  const emails = comment.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
  console.log(`emails: ${emails}`)
  const prelude = "The following email addresses were found in the previous comment: ";
  const epilogue = "\r\n\r\nPlease delete this comment from the issue once the addresses have been removed.";
  core.setOutput(
    "emails", 
    emails 
      ? prelude + emails.join(", ") + epilogue
      : ""
  );
} catch (error) {
  core.setFailed(error.message);
}