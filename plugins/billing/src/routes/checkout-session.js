const Stripe = require('stripe');

module.exports = async (req, res, next) => {
  const { config, HubError } = req.hub;

  try {
    const stripeConfig = config.plugins.billing.stripe;
    if (!['starter', 'team'].includes(req.body.planName)) throw new Error(`Unknown plan ${req.body.planName}`);

    const stripe = Stripe(stripeConfig.secret_key);
    const urlPrefix = `${config.app.protocol}://${config.app.hostname}${process.env.NODE_ENV !== 'production' ? `:${config.app.port}` : ''}`;

    const sessionConfig = {
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: req.user.email,
      subscription_data: {
        items: [{
          plan: stripeConfig[`${req.body.planName}_plan`],
        }],
      },
      success_url: `${urlPrefix}/settings/upgrade?status=success&stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${urlPrefix}/settings/upgrade?status=cancelled`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    next(new HubError({
      type: 'plugins-billing-error',
      title: 'Billing plugin has failed',
      detail: e.message,
      status: 500,
    }));
  }
};
