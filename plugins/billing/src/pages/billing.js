import SettingsLayout from 'components/SettingsLayout'

export default function BillingPage({ organizations }) {
  return (
    <SettingsLayout
      active="billing"
      organizations={organizations}
    >
      <div>
        <div className="mb-12">
          <h3 className="text-xl mb-4">Billing</h3>
        </div>
      </div>
    </SettingsLayout>
  )
}

export async function getServerSideProps({ req: { hub, userPublicInfo } }) {
  if (!userPublicInfo) return { props: {} }

  const { list: listOrgs } = hub.handlers.orgs
  const organizations = await listOrgs(userPublicInfo.id)

  return {
    props: {
      organizations,
    },
  }
}
