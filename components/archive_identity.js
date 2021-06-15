import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { IDX } from '@ceramicstudio/idx'
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'

async function connectIdx({
  endpoint = "https://ceramic-clay.3boxlabs.com",
  resolvers = null,
  address = null,
  provider = null,
  ceramicClient = null
} = {}) {
  let ceramic;

  if (!ceramicClient) {
    ceramic = new CeramicClient(endpoint)
  } else {
    ceramic = ceramicClient
  }

  if (!resolvers) {
    resolvers = {
      ...ThreeIdResolver.getResolver(ceramic)
    }
  } else {
    resolvers = resolvers.reduce((acc, next) => {
      if (next.requiresCeramic) {
        let res = next.resolver.call(this, ceramic)
        acc = {
          ...acc,
          ...res
        }
      } else {
        acc = {
          ...acc,
          ...next.resolver
        }
      }
      return acc
    }, {})
  }

  if (!address) {
    const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
    address = addresses[0]
  }

  const threeIdConnect = new ThreeIdConnect()

  if (!provider) {
    provider = new EthereumAuthProvider(window.ethereum, address)
  }

  await threeIdConnect.connect(provider)

  const did = new DID({
    provider: threeIdConnect.getDidProvider(),
    resolver: resolvers
  })

  ceramic.setDID(did) 
  await ceramic.did.authenticate()
  const idx = new IDX({ ceramic })

  return {
    ceramic, did, idx
  }
}

function addNumber(value, value2) {
  return value + value2;
}

export {
  connectIdx,
  addNumber
}