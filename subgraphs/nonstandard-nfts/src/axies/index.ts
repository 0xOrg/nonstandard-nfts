import {
  Account,
  Transfer,
  Approval,
} from '../../generated/schema'

import {
  Axies,
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
} from '../../generated/Axies/Axies'

import {
  fetchRegistry,
  fetchToken,
} from '../utils'

import {
  events,
  transactions,
} from '@amxx/graphprotocol-utils'

export function handleTransfer(event: TransferEvent): void {
  let registry = fetchRegistry(Axies.bind(event.address));
  let token = fetchToken(registry, event.params._tokenId)
  let from = new Account(event.params._from.toHex())
  let to = new Account(event.params._to.toHex())

  token.owner = to.id

  registry.save()
  token.save()
  from.save()
  to.save()

  let ev = new Transfer(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp = event.block.timestamp
  ev.token = token.id
  ev.from = from.id
  ev.to = to.id
  ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let registry = fetchRegistry(Axies.bind(event.address));
  let token = fetchToken(registry, event.params._tokenId)
  let owner = new Account(event.params._owner.toHex())
  let approved = new Account(event.params._approved.toHex())

  token.approval = approved.id

  token.save()
  owner.save()
  approved.save()

  let ev = new Approval(events.id(event))
  ev.transaction = transactions.log(event).id
  ev.timestamp = event.block.timestamp
  ev.token = token.id
  ev.owner = owner.id
  ev.approved = approved.id
  ev.save()
}