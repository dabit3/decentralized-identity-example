import { Core } from '@self.id/core'
const SID = require('@self.id/web')
const { EthereumAuthProvider, SelfID, WebClient } = SID

async function webClient({
  ceramicNetwork = 'testnet-clay',
  connectNetwork = 'testnet-clay',
  address = '',
  provider = null,
  client = null
} = {}) {
  let ethereum = window.ethereum;

  if (!ethereum) return {
    error: "No ethereum wallet detected"
  }

  if (!client) {
    client = new WebClient({
      ceramic: ceramicNetwork,
      connectNetwork
    })
  }

  if (!address) {
    [address] = await ethereum.request({ method: 'eth_requestAccounts' })
  }

  if (!provider) {
    provider = new EthereumAuthProvider(window.ethereum, address)
  }

  await client.authenticate(provider)

  const selfId = new SelfID({ client })
  const id = selfId.did._id

  return {
    client, id, selfId, error: null
  }
}

const networks = {
  ethereum: 'ethereum',
  bitcoin: 'bitcoin',
  cosmos: 'cosmos',
  kusama: 'kusama'
}

const caip10Links = {
  ethereum: "@eip155:1",
  bitcoin: '@bip122:000000000019d6689c085ae165831e93',
  cosmos: '@cosmos:cosmoshub-3',
  kusama: '@polkadot:b0a8d493285c2df73290dfb7e61f870f'
}

/*
CAIP-10 Account IDs is a blockchain agnostic way to describe an account on any blockchain. This may be an externally owned key-pair account, or a smart contract account. Ceramic uses CAIP-10s as a way to lookup the DID of a user using a caip10-link streamType in Ceramic. Learn more in the Ceramic documentation.
*/
async function getRecord({
  ceramicNetwork = 'testnet-clay',
  network = 'ethereum',
  client = null,
  schema = 'basicProfile',
  address = null
} = {}) {
  let ethereum = window.ethereum;
  let record;

  if (!ethereum) return {
    error: "No ethereum wallet detected"
  }

  if (!client) {
    client = new Core({ ceramic: ceramicNetwork })
  }

  if (!address) {
   [address] = await ethereum.request({ method: 'eth_requestAccounts' })
  }
  const capLink = caip10Links[network]
  const did = await client.getAccountDID(`${address}${capLink}`)
  
  record = await client.get(schema, did)
  console.log('record: ', record)
  return {
    record, error: null
  }
}

export {
  webClient,
  getRecord
}