import { Fetcher, Route, Token } from 'goswap-sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, TreasuryAllocationTime } from './types';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
// import { createGlobalStyle } from 'styled-components';

/**
 * An API module of Basis Cash contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class BasisCash {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;

  bacDai: Contract;
  GOC: ERC20;
  GOS: ERC20;
  GOB: ERC20;
  GOSLP: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal); // TODO: add decimal
    }
    this.GOC = new ERC20(deployments.Cash.address, provider, 'GOC');
    this.GOS = new ERC20(deployments.Share.address, provider, 'GOS');
    this.GOB = new ERC20(deployments.Bond.address, provider, 'GOB');
    this.GOSLP = new ERC20(deployments.GosLp.address, provider, 'GLP:GOS-HUSD');

    // Uniswap V2 Pair
    this.bacDai = new Contract(
      externalTokens['GOC_HUSD-LP'][0],
      IUniswapV2PairABI,
      provider,
    );

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);

    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.GOC, this.GOS, this.GOB, this.GOSLP, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.bacDai = this.bacDai.connect(this.signer);
    // console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    // this.fetchBoardroomVersionOfUser()
    //   .then((version) => (this.boardroomVersionOfUser = version))
    //   .catch((err) => {
    //     console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      // });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }

  /**
   * @returns Basis Cash (GOC) stats from Uniswap.
   * It may differ from the GOC price used on Treasury (which is calculated in TWAP)
   */
  async getCashStatFromUniswap(): Promise<TokenStat> {
    const supply = await this.GOC.displayedTotalSupply();
    return {
      priceInDAI: await this.getTokenPriceFromUniswap(this.GOC),
      totalSupply: supply,
    };
  }

  /**
   * @returns Estimated Basis Cash (GOC) price data,
   * calculated by 1-day Time-Weight Averaged Price (TWAP).
   */
  async getCashOraclePriceInLastTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle } = this.contracts;

    const expectedPrice = await SeigniorageOracle.expectedPrice(
      this.GOC.address,
      ethers.utils.parseEther('1'),
    );
    const supply = await this.GOC.displayedTotalSupply();

    return {
      priceInDAI: getDisplayBalance(expectedPrice,8),
      totalSupply: supply,
    };
  }

  /**
   * @returns Estimated Basis Cash (GOC) price data,
   * calculated by 1-day Time-Weight Averaged Price (TWAP).
   */
  async getCashStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle } = this.contracts;

    const expectedPrice = await SeigniorageOracle.expectedPrice(
      this.GOC.address,
      ethers.utils.parseEther('1'),
    );
    const supply = await this.GOC.displayedTotalSupply();

    return {
      priceInDAI: getDisplayBalance(expectedPrice,8),
      totalSupply: supply,
    };
  }

  async getCashPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getSeigniorageOraclePrice();
  }

  async getOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getOraclePrice();
  }

  async getBondStat(): Promise<TokenStat> {
    const decimals = BigNumber.from(10).pow(18);

    const cashPrice: BigNumber = await this.getOraclePriceInLastTWAP();
    const bondPrice = cashPrice.pow(2).div(decimals);

    return {
      priceInDAI: getDisplayBalance(bondPrice),
      totalSupply: await this.GOB.displayedTotalSupply(),
    };
  }

  async getShareStat(): Promise<TokenStat> {
    return {
      priceInDAI: await this.getTokenPriceFromUniswap(this.GOS),
      totalSupply: await this.GOS.displayedTotalSupply(),
    };
  }

  async getTokenPriceFromUniswap(tokenContract: ERC20): Promise<string> {
    await this.provider.ready;

    const { chainId } = this.config;
    const { HUSD } = this.config.externalTokens;

    const husd = new Token(chainId, HUSD[0], 8);
    const token = new Token(chainId, tokenContract.address, 18);

    try {
      const husdToToken = await Fetcher.fetchPairData(husd, token, this.provider);
      const priceInHUSD = new Route([husdToToken], token);
      console.log(priceInHUSD.midPrice)
      return priceInHUSD.midPrice.toSignificant(3);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.buyBonds(
      decimalToBalance(amount)
      // await this.getOraclePriceInLastTWAP(),
    );
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.redeemBonds(decimalToBalance(amount));
  }

  async earnedFromBank(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.earned(account);
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(
    poolName: ContractName,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.balanceOf(account);
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.stake(amount);
    return await pool.stake(amount, this.gasOptions(gas));
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.withdraw(amount);
    return await pool.withdraw(amount, this.gasOptions(gas));
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.getReward();
    return await pool.getReward(this.gasOptions(gas));
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.exit();
    return await pool.exit(this.gasOptions(gas));
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    // const { Boardroom1, Boardroom2 } = this.contracts;
    // const balance1 = await Boardroom1.getShareOf(this.myAccount);
    // if (balance1.gt(0)) {
    //   console.log(
    //     `👀 The user is using Boardroom v1. (Staked ${getDisplayBalance(balance1)} BAS)`,
    //   );
    //   return 'v1';
    // }
    // const balance2 = await Boardroom2.balanceOf(this.myAccount);
    // if (balance2.gt(0)) {
    //   console.log(
    //     `👀 The user is using Boardroom v2. (Staked ${getDisplayBalance(balance2)} BAS)`,
    //   );
    //   return 'v2';
    // }
    return 'latest';
  }

  boardroomByVersion(version: string): Contract {
    if (version === 'lp') {
      return this.contracts.lpBoardroom;
    }
    return this.contracts.shareBoardroom;
  }

  currentBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      throw new Error('you must unlock the wallet to continue.');
    }
    return this.boardroomByVersion(this.boardroomVersionOfUser);
  }
  currentLpBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      throw new Error('you must unlock the wallet to continue.');
    }
    return this.boardroomByVersion('lp');
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async stakeShareToBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async stakeShareToLpBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentLpBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.balanceOf(this.myAccount);
  }
  async getStakedSharesOnLpBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentLpBoardroom();
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.earned(this.myAccount);
  }

  async getEarningsOnLpBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentLpBoardroom();
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async withdrawShareFromLpBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentLpBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async canWithdrawFromBoardroom(): Promise<Boolean> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.canWithdraw(this.myAccount);
  }

  async canWithdrawFromLpBoardroom(): Promise<Boolean> {
    const Boardroom = this.currentLpBoardroom();
    return await Boardroom.canWithdraw(this.myAccount);
  }

  async canWithdrawTimeFromBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    const WithdrawTime: BigNumber = await Boardroom.getCanWithdrawTime(this.myAccount);
    return WithdrawTime.add(28800);
  }

  async canWithdrawTimeFromLpBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentLpBoardroom();
    const WithdrawTime: BigNumber = await Boardroom.getCanWithdrawTime(this.myAccount);
    return WithdrawTime.add(28800);
  }

  async harvestCashFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.claimReward();
  }
  async harvestCashFromLpBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentLpBoardroom();
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.exit();
  }
  async exitFromLpBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentLpBoardroom();
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<TreasuryAllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const period: BigNumber = await Treasury.getPeriod();

    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(nextAllocation.getTime() - period.toNumber() * 1000);
    return { prevAllocation, nextAllocation };
  }
  async canAllocateSeigniorage(): Promise<Boolean> {
    const { Treasury } = this.contracts;
    const CurrentEpoch: BigNumber = await Treasury.getCurrentEpoch();
    const NextEpoch: BigNumber = await Treasury.getNextEpoch();
    const StartTime: BigNumber = await Treasury.getStartTime();
    
    if( StartTime.mul(1000).toNumber() < Date.now() && CurrentEpoch.toNumber() >= NextEpoch.toNumber()){
      return true;
    }else{
      return false
    }    
  }
  async allocateSeigniorage(): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.allocateSeigniorage();
  }
}
