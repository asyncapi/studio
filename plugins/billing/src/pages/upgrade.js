import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import capitalize from 'lodash/capitalize'
import SettingsLayout from 'components/SettingsLayout'
import AlertError from 'components/AlertError'
import AlertSuccess from 'components/AlertSuccess'
import AlertWarning from 'components/AlertWarning'

export default function BillingPage({ user, status, plans = [], stripePublicKey, stripeSubscriptionId, organizations }) {
  const [errorMessage, setErrorMessage] = useState()
  let stripePromise
  const plansDescription = [
    {
      name: 'free',
      displayName: 'Free',
      description: 'Great for individuals',
      price: 0,
    },
    {
      name: 'starter',
      displayName: 'Starter',
      description: 'Share and collaborate with your team 🙌',
      price: 60,
    },
    {
      name: 'team',
      displayName: 'Team',
      description: 'Share and collaborate with your team. No limits 💪',
      price: 299,
    },
  ];

  useEffect(() => {
    stripePromise = loadStripe(stripePublicKey);
  }, [])

  const onUpgradeClick = planName => async () => {
    if (stripeSubscriptionId) {
      updateSubscription(planName)
    } else {
      goToCheckout(planName)
    }
  }

  const updateSubscription = async (planName) => {
    try {
      await fetch('/settings/upgrade/subscription', {
        method: 'PUT',
        body: JSON.stringify({ planName, stripeSubscriptionId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.reload()
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  const goToCheckout = async (planName) => {
    try {
      const res = await fetch('/settings/upgrade/session', {
        method: 'POST',
        body: JSON.stringify({ planName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { sessionId } = await res.json()

      // When the customer clicks on the button, redirect them to Stripe Checkout.
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })
      if (error) throw error
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  const renderError = () => {
    if (!errorMessage && status !== 'error') return
    return (
      <AlertError
        title="Oops! Something went wrong."
        description={<>{errorMessage && (<p className="mb-2">{errorMessage}</p>)}<p>Try again. If the error persists, please contact us.</p></>}
      />
    )
  }

  const renderSuccess = () => {
    if (status !== 'success') return
    return (
      <AlertSuccess
        title="Awesome! Your order has been completed."
        description={`You're now on the ${capitalize(user.plan.name)} plan.`}
      />
    )
  }

  const renderCancelled = () => {
    if (status !== 'cancelled') return
    return (
      <AlertWarning
        title="Upgrade has been cancelled."
        description={`Click the Upgrade button to try again.`}
      />
    )
  }

  const renderPlan = ({ name, displayName, description, price }) => {
    const plan = plans.find(p => p.name === name);
    const isCurrentPlan = user.plan.name === name;

    return (
      <div className={`bg-white shadow overflow-hidden sm:rounded-lg mt-8 border-t-2 ${isCurrentPlan ? 'border-gray-300' : 'border-indigo-500'}`}>
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            { displayName }
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
            { description }
          </p>
        </div>
        <div className="px-4 py-5 sm:p-0">
          <dl>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                Organizations
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                { plan.restrictions['organizations.maxCount'] || 'Unlimited' }
              </dd>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                Users per organization
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                { plan.restrictions['organizations.users.maxCount'] || 'Unlimited' }
              </dd>
            </div>
            <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                Price
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                { price === 0 ? 'Free' : `${price}  €/month` }
              </dd>
            </div>
            <div className={`mt-8 sm:mt-0 sm:border-t ${isCurrentPlan ? 'sm:border-gray-200' : 'sm:border-indigo-500'}`}>
              {
                isCurrentPlan ? (
                  <div className="text-center py-3">
                    <span className="bg-gray-300 px-3 py-1 rounded text-sm">This is your current plan</span>
                  </div>
                ) : (
                  <button type="button" className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white text-center py-3" role="link" onClick={onUpgradeClick(name)}>
                    <span className="inline-block mr-2">Upgrade</span>🚀
                  </button>
                )
              }
            </div>
          </dl>
        </div>
      </div>
    )
  }

  const renderCurrentPlan = () => {
    const currentPlan = plansDescription.find(p => p.name === user.plan.name)
    return renderPlan(currentPlan)
  }

  const renderHigherPlans = () => {
    const currentPlan = plansDescription.find(p => p.name === user.plan.name)
    const otherPlans = plansDescription.filter(p => p.name !== user.plan.name && p.price > currentPlan.price)
    return otherPlans.map((p, i) => (
      <div key={i}>
        { renderPlan(p) }
      </div>
    ))
  }

  return (
    <SettingsLayout
      activeSection="upgrade"
      organizations={organizations}
    >
      <div>
        <div className="mb-12 w-5xl">
          <h3 className="text-xl mb-4">Upgrades</h3>
          { renderSuccess() || renderCancelled() || renderError() }

          { renderCurrentPlan() }
          { renderHigherPlans() }
        </div>
      </div>
    </SettingsLayout>
  )
}

export async function getServerSideProps({ req: { flash, hub, userPublicInfo } }) {
  const flashMessages = flash()

  const { findById: getUser, getPluginData } = hub.users
  const user = await getUser(userPublicInfo.id)
  const billingInfo = await getPluginData(userPublicInfo.id, 'billing')

  const { list: listOrgs } = hub.orgs
  const organizations = userPublicInfo ? await listOrgs(userPublicInfo.id) : []

  const { list: listPlans } = hub.plans
  const plans = await listPlans()

  return {
    props: {
      organizations,
      status: flashMessages.status ? flashMessages.status : null,
      user: user || null,
      plans,
      stripePublicKey: hub.config.plugins.billing.stripe.public_key,
      stripeSubscriptionId: billingInfo.stripeSubscriptionId || null,
    },
  }
}
