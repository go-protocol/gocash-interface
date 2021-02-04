import { BigNumber } from 'ethers';

export const DECIMALS_18 = BigNumber.from(10).pow(18);

export const BOND_REDEEM_PRICE = 1.02;
export const BOND_REDEEM_PRICE_BN = DECIMALS_18.mul(102).div(100);
