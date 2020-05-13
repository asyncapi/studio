const Stripe = require('stripe');

module.exports = async (req, res, next) => {
  const { status, stripe_session_id } = req.query;
  const { config, users } = req.hub;

  if (status && stripe_session_id) {
    try {
      const stripe = Stripe(config.plugins.billing.stripe.secret_key);
      const session = await stripe.checkout.sessions.retrieve(stripe_session_id);
      const plan = session.display_items[0].plan.nickname;
      await users.savePluginData(req.user.id, 'billing', {
        stripeSubscriptionId: session.subscription,
      });

      const { changePlanTo } = req.hub.users;
      await changePlanTo(plan.toLowerCase(), req.user.id);
      req.flash('status', 'success');
    } catch (e) {
      console.error(e);
      req.flash('status', 'error');
    }

    res.redirect(req.path);
  }

  res.render('/settings/upgrade', req.params);
};
