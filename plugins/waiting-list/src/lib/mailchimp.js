const MailchimpAPI = require('mailchimp-api-v3');
const md5 = require('md5');

class Mailchimp {
  constructor(config) {
    this.config = config;
    this.mailchimp = new MailchimpAPI(config.plugins.waiting_list.mailchimp.api_key);
  }

  addUserToWaitingList(user) {
    const { displayName, email } = user;
    return this.mailchimp.put(`/lists/${this.config.plugins.waiting_list.mailchimp.audience_id}/members/${md5(email)}`, {
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields: {
        FNAME: displayName,
      },
    });
  }
}

module.exports = Mailchimp;
