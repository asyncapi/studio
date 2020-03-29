import { useState } from 'react'
import SettingsLayout from '../../../../components/SettingsLayout'
import Invite from '../../../../components/Invite'
import InvitationList from '../../../../components/InvitationList'

export default function OrganizationPage ({ organizations, selectedOrg, invitations = [] }) {
  const [invitationList, setInvitations] = useState(invitations)

  const org = organizations.find(o => o.id == selectedOrg)

  const onInvite = (invitation) => {
    setInvitations([invitation, ...invitationList])
  }

  const onRemoveInvitation = (invitationId) => {
    const invites = invitationList.filter(i => i.id !== invitationId)
    setInvitations(invites)
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
