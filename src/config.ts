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
      'GOS_HUSD-GLP': ['0xd0E8D781fAe230E3DA6e45ED881c99BA639cA400', 18],
      'GOC_HUSD-GLP': ['0x28BFcd3c234B710d93232B5e51a2e8b8a5bb9D2f', 18],
      'HT_HUSD-GLP': ['0xBe963435F750bB60e45fFa98318E74ea6E3aC0d7', 18],
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
      HUSD: ['0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6', 8],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'GOS_HUSD-GLP': ['0xd0E8D781fAe230E3DA6e45ED881c99BA639cA400', 18],
      'GOC_HUSD-GLP': ['0x28BFcd3c234B710d93232B5e51a2e8b8a5bb9D2f', 18],
      'HT_HUSD-GLP': ['0xBe963435F750bB60e45fFa98318E74ea6E3aC0d7', 18],
    },
    baseLaunchDate: new Date('2020-11-29T23:00:00Z'),
    bondLaunchesAt: new Date('2020-12-05T00:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 30000,
    gasLimitMultiplier: 1.7,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  HUSDGOCLPTokenSharePool: {
    name: 'Earn GOS by GOC-HUSD-LP',
    contract: 'HUSDGOCLPTokenSharePool',
    depositTokenName: 'GOC_HUSD-GLP',
    earnTokenName: 'GOS',
    finished: false,
    sort: 1,
  },
  HUSDGOSLPTokenSharePool: {
    name: 'Earn GOS by GOS-HUSD-LP',
    contract: 'HUSDGOSLPTokenSharePool',
    depositTokenName: 'GOS_HUSD-GLP',
    earnTokenName: 'GOS',
    finished: false,
    sort: 2,
  },
  HTHUSDLPTokenGOTPool: {
    name: 'Earn GOT by HT-HUSD-LP',
    contract: 'HTHUSDLPTokenGOTPool',
    depositTokenName: 'HT_HUSD-GLP',
    earnTokenName: 'GOT',
    finished: false,
    sort: 3,
  },
};
// export default configurations[process.env.NODE_ENV || "development"];
export default configurations["development"];
