const Mailchimp = require('mailchimp-api-v3');
const md5 = require('md5');
const config = require('./config');
const segment = require('./segment');

const mailchimp = new Mailchimp(config.mailchimp.api_key);

module.exports.addUserToWaitingList = (user) => {
  const { displayName, email } = user;
  return mailchimp.put(`/lists/${config.mailchimp.waiting_list.audience_id}/members/${md5(email)}`, {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: displayName,
    },
  })
  .catch(err => {
    console.error(err);
    segment
      .logAddUserToWaitlistFailure(user, err)
      .catch(console.error);
  });
};
