import { ChainId } from 'goswap-sdk';
import { Configuration } from './basis-cash/config';
import { BankInfo } from './basis-cash';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.HECOTEST,
    etherscanUrl: 'https://scan-testnet.hecochain.com',
    defaultProvider: 'https://http-testnet.hecochain.com',
    deployments: require('./basis-cash/deployments/deployments.mainnet.json'),
    externalTokens: {
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      HUSD: ['0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6', 8],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'GOT_HUSD-GLP': ['0xf9c02c0BEb6B8D6512Aa9ba34c59c0550B220eF4', 18],
      'GOC_HUSD-GLP': ['0x938F507c1a90dc10446D5bA38888C6658D9a26A9', 18],
    },
    baseLaunchDate: new Date('2020-11-26T00:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  production: {
    chainId: ChainId.HECOMAIN,
    etherscanUrl: 'https://scan.hecochain.com',
    defaultProvider: 'https://http-mainnet.hecochain.com',
    deployments: require('./basis-cash/deployments/deployments.mainnet.json'),
    externalTokens: {
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      HUSD: ['0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6', 18],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'GOT_HUSD-GLP': ['0xf9c02c0BEb6B8D6512Aa9ba34c59c0550B220eF4', 18],
      'GOC_HUSD-GLP': ['0x938F507c1a90dc10446D5bA38888C6658D9a26A9', 18],
    },
    baseLaunchDate: new Date('2020-11-29T23:00:00Z'),
    bondLaunchesAt: new Date('2020-12-05T00:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 30000,
    gasLimitMultiplier: 1.7,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  DAIBACLPTokenSharePool: {
    name: 'Earn GOT by GOC-HUSD-LP',
    contract: 'HUSDGOCLPTokenSharePool',
    depositTokenName: 'GOC_HUSD-GLP',
    earnTokenName: 'GOT',
    finished: false,
    sort: 1,
  },
  DAIBASLPTokenSharePool: {
    name: 'Earn GOT by GOT-HUSD-LP',
    contract: 'HUSDGOTLPTokenSharePool',
    depositTokenName: 'GOT_HUSD-GLP',
    earnTokenName: 'GOT',
    finished: false,
    sort: 2,
  },
};
// export default configurations[process.env.NODE_ENV || "development"];
export default configurations["development"];
