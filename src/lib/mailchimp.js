const Mailchimp = require('mailchimp-api-v3');
const md5 = require('md5');
const config = require('./config');
const segment = require('./segment');

const mailchimp = new Mailchimp(config.mailchimp.api_key);

module.exports.addUserToWaitingList = (user) => {
  const { display_name, email } = user;
  return mailchimp.put(`/lists/${config.mailchimp.waiting_list.audience_id}/members/${md5(email)}`, {
    email_address: email,
    status_if_new: 'subscribed',
    merge_fields: {
      FNAME: display_name,
    },
  })
  .catch(err => {
    console.error(err);
    segment
      .logAddUserToWaitlistFailure(user, err)
      .catch(console.error);
  });
};
