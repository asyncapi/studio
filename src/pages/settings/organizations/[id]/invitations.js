import capitalize from 'lodash/capitalize'
import { useContext, useState } from 'react'
import AppContext from '../../../../contexts/AppContext'
import SettingsLayout from '../../../../components/SettingsLayout'
import Invite from '../../../../components/Invite'
import InvitationList from '../../../../components/InvitationList'
import UpgradeButton from '../../../../components/UpgradeButton'

export default function OrganizationPage ({ organizations, selectedOrg, invitations = [] }) {
  const [invitationList, setInvitations] = useState(invitations)
  const { user } = useContext(AppContext)

  const org = organizations.find(o => o.id == selectedOrg)

  const onInvite = (invitation) => {
    setInvitations([invitation, ...invitationList])
  }

  const onRemoveInvitation = (invitationId) => {
    const invites = invitationList.filter(i => i.id !== invitationId)
    setInvitations(invites)
  }

  const plan = org.plan || {}
  const restrictions = plan.restrictions || {}
  const maxOrgUsersCount = Number(restrictions['organizations.users.maxCount'])
  const orgUsersCount = org.organizationUsers.length
  const canInvite = restrictions['organizations.invite'] !== false
  const canInviteMoreUsers = orgUsersCount < maxOrgUsersCount

  if (!canInvite || !canInviteMoreUsers) {
    let message

    if (!canInvite) {
      message = (<>You are currently on the {capitalize(org.planName)} plan. Upgrade to a paid plan to collaborate with your teammates.</>)
    } else if (!canInviteMoreUsers) {
      message = (<>You can't invite more users to this organization. Upgrade to invite more.</>)
    }

    return (
      <SettingsLayout
        active="orgs"
        organizations={organizations}
        selectedOrg={selectedOrg}
        selectedSection="invitations"
      >
        <div className="mb-4">
          {message}
        </div>
        <UpgradeButton />
      </SettingsLayout>
    )
  }

  return (
    <SettingsLayout
      active="orgs"
      organizations={organizations}
      selectedOrg={selectedOrg}
      selectedSection="invitations"
    >
      <div className="mb-12">
        <h3 className="text-xl mb-4">Create invitation link</h3>
        <Invite
          organization={org}
          onInvite={onInvite}
        />
      </div>

      { !!invitationList.length && (
        <div className="mb-12">
          <h3 className="text-xl mt-12 mb-4">Active invitation links</h3>
          <InvitationList
            invitations={invitationList}
            onRemoveInvitation={onRemoveInvitation}
          />
        </div>
      )}
    </SettingsLayout>
  )
}

export async function getServerSideProps ({ req, params }) {
  if (!req.userPublicInfo) return { props: {} }

  const { list: listOrgs } = require('../../../../handlers/orgs')
  const organizations = await listOrgs(req.userPublicInfo.id)

  const { list: listInvitations } = require('../../../../handlers/invitations')
  const invitations = await listInvitations(params.id, req.userPublicInfo.id)

  return {
    props: {
      organizations,
      selectedOrg: params.id,
      invitations,
    },
  }
}
