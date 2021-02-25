import React, { useCallback, useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useBasisCash from '../../hooks/useBasisCash';
import useBondOraclePriceInLastTWAP from '../../hooks/useBondOraclePriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../basis-cash/constants';
import background_3 from '../../assets/img/background_3.jpg';
import { useTranslation } from 'react-i18next';

const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const basisCash = useBasisCash();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useBondOraclePriceInLastTWAP();
  const { t } = useTranslation()
  const bondBalance = useTokenBalance(basisCash?.GOB);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.buyBonds(amount);
      const bondAmount = Number(amount) / Number(getDisplayBalance(cashPrice));
      addTransaction(tx, {
        summary: `${t("use")} ${amount} GOC ${t("buy")} ${bondAmount.toFixed(2)} GOB`,
      });
    },
    [basisCash, addTransaction, cashPrice,t],
  );

  const priceInDai = bondStat?.priceInDAI ? (Math.floor(Number(bondStat?.priceInDAI) * 100) / 100).toString() : '0'

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.redeemBonds(amount);
      addTransaction(tx, { summary: `${t("redeem")} ${amount} GOB` });
    },
    [basisCash, addTransaction,t],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.priceInDAI) < 1.0, [bondStat]);

  const isLaunched = Date.now() >= config.bondLaunchesAt.getTime();
  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={<img src={require("../../assets/img/bond.png")} width="50%" height="95%" alt="bond"/>}
            title={t("buyandredeem")}
            subtitle={t("redeemandearn")}
          />
          <LaunchCountdown
            deadline={config.bondLaunchesAt}
            description={t("howwork")}
            descriptionLink="https://docs.basis.cash/mechanisms/stabilization-mechanism"
          />
        </Page>
      </Switch>
    );
  }
  return (
    <Background>
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader
                // icon={<img src={require("../../assets/img/bond.png")} width="50%" height="95%" alt="bond"/>}
                title={t("buyandredeem")}
                subtitle={t("redeemandearn")}
              />
            </Route>
            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action={t("buy")}
                  fromToken={basisCash.GOC}
                  fromTokenName={t("cashgoc")}
                  toToken={basisCash.GOB}
                  toTokenName={t("bondgob")}
                  priceDesc={
                    !isBondPurchasable
                      ? t("gocdown")
                      : `${Math.floor(
                          100 / Number(bondStat.priceInDAI) - 100,
                        )}% ${t("gocup")} $${BOND_REDEEM_PRICE}${t("returna")}`
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="GOC"
                  description={t("cycle")}
                  price={getDisplayBalance(cashPrice, 18, 2)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="GOB"
                  description={t("currentprice")+": (GOC)^2"}
                  price={priceInDai}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action={t("buy")}
                  fromToken={basisCash.GOB}
                  fromTokenName={t("bondgob")}
                  toToken={basisCash.GOC}
                  toTokenName={t("cashgoc")}
                  priceDesc={`${getDisplayBalance(bondBalance)} GOB${t("active")}`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `${t("whengoc")} > $${BOND_REDEEM_PRICE}${t("returna")}` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button onClick={() => connect('injected')} text={t("unlockwallet")} />
          </div>
        )}
      </Page>
    </Switch>
    </Background>
  );
};

const Background = styled.div`
background: url(${background_3});
background-size: cover;
background-repeat: no-repeat;
  }
`;
const StyledBond = styled.div`
  display: flex;
  width: 900px;
  @media (max-width: 835px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 835px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 835px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;