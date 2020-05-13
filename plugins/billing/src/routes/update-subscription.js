const Stripe = require('stripe');

module.exports = async (req, res, next) => {
  const { config, HubError, users } = req.hub;

  try {
    const { planName, stripeSubscriptionId } = req.body;
    if (!['starter', 'team'].includes(planName) || !stripeSubscriptionId) {
      throw new HubError({
        type: 'plugin-billing-update-subscription-invalid-params',
        title: 'Missing or invalid required params',
        detail: `The planName (${planName}) and/or the stripeSubscriptionId (${stripeSubscriptionId}) params are missing or invalid.`,
        status: 422,
      });
    }

    const stripeConfig = config.plugins.billing.stripe;
    const stripe = Stripe(stripeConfig.secret_key);

    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    if (!subscription) {
      throw new HubError({
        type: 'plugin-billing-update-subscription-not-found',
        title: 'Subscription not found',
        detail: `The Stripe subscription with id (${stripeSubscriptionId}) doesn't exist.`,
        status: 422,
      });
    }

    const items = subscription.items.data;
    const existingItemId = items[0].id;

    const updatedSubscription = await stripe.subscriptions.update(stripeSubscriptionId, {
      items: [{
        id: existingItemId,
        plan: config.plugins.billing.stripe[`${planName}_plan`],
      }]
    });

    await users.changePlanTo(updatedSubscription.plan.nickname.toLowerCase(), req.user.id);

    res.send({
      stripeSubscriptionId: updatedSubscription.id,
    });
  } catch (e) {
    if (e instanceof HubError) return next(e);

    console.error(e);

    next(new HubError({
      type: 'plugin-billing-update-subscription-unexpected',
      title: 'Unexpected error',
      detail: e.message,
      status: 500,
    }));
  }
};
