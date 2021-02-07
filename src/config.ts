import { ChainId } from 'goswap-sdk';
import { Configuration } from './basis-cash/config';
import { BankInfo } from './basis-cash';
// import { formatUnits } from 'ethers/lib/utils';
// import { BigNumber } from 'ethers';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.HECOTEST,
    etherscanUrl: 'https://scan-testnet.hecochain.com',
    defaultProvider: 'https://http-testnet.hecochain.com',
    deployments: require('./basis-cash/deployments/deployments.testnet.json'),
    externalTokens: {
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      HUSD: ['0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6', 8],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'GOS_HUSD-LP': ['0x85C0594364353B888E4213E33dbD8Ecd653506a4', 18],
      'GOC_HUSD-LP': ['0xC33F68fBBCB529faB10aB5FcFD77BaD7cE9fbfFA', 18],
      'HT_HUSD-GLP': ['0xBe963435F750bB60e45fFa98318E74ea6E3aC0d7', 18],
      'GOT_HUSD-GLP': ['0xC31b9f33fB2C54B789C263781CCEE9b23b747677', 18],
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
      HUSD: ['0x0298c2b32eae4da002a15f36fdf7615bea3da047', 8],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'GOS_HUSD-LP': ['0xdaDE2b002d135c5796f7cAAd544f9Bc043D05C9B', 18],
      'GOC_HUSD-LP': ['0xEe09490789564e22c9b6252a2419A57055957a47', 18],
      'HT_HUSD-GLP': ['0xBe963435F750bB60e45fFa98318E74ea6E3aC0d7', 18],
      'GOT_HUSD-GLP': ['0xC31b9f33fB2C54B789C263781CCEE9b23b747677', 18],
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
    name: '曲率引擎赛道',
    contract: 'HUSDGOCLPTokenSharePool',
    depositTokenName: 'GOC_HUSD-LP',
    earnTokenName: 'GOS',
    finished: false,
    pairName:'GOC-HUSD',
    pairUrl:'https://goswap.app/#/add/0x271B54EBe36005A7296894F819D626161C44825C/0x0298c2b32eae4da002a15f36fdf7615bea3da047',
    sort: 1,
  },
  HUSDGOSLPTokenSharePool: {
    name: '引力弹弓赛道',
    contract: 'HUSDGOSLPTokenSharePool',
    depositTokenName: 'GOS_HUSD-LP',
    earnTokenName: 'GOS',
    finished: false,
    pairName:'GOS-HUSD',
    pairUrl:'https://goswap.app/#/add/0x3bb34419a8E7d5E5c68B400459A8eC1AFfe9c56E/0x0298c2b32eae4da002a15f36fdf7615bea3da047',
    sort: 2,
  },
  // HTHUSDLPTokenGOTPool: {
  //   name: '水滴赛道',
  //   contract: 'HTHUSDLPTokenGOTPool',
  //   depositTokenName: 'HT_HUSD-GLP',
  //   earnTokenName: 'GOT',
  //   finished: false,
  //   pairName:'HT-HUSD',
  //   pairUrl:'https://goswap.app/#/add/CURRENCY/0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6',
  //   sort: 3,
  // },
  // GOTHUSDLPTokenGOTPool: {
  //   name: '可控核聚变赛道',
  //   contract: 'GOTHUSDLPTokenGOTPool',
  //   depositTokenName: 'GOT_HUSD-GLP',
  //   earnTokenName: 'GOT',
  //   finished: false,
  //   pairName:'GOT-HUSD',
  //   pairUrl:'https://goswap.app/#/add/0xA7d5b5Dbc29ddef9871333AD2295B2E7D6F12391/0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6',
  //   sort: 4,
  // },
};
// export default configurations[process.env.NODE_ENV || "development"];
export default configurations["production"];
