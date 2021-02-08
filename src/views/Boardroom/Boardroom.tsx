import React, {useMemo } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import LpHarvest from './components/LpHarvest';
import Stake from './components/Stake';
import LpStake from './components/LpStake';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useRedeemOnLpBoardroom from '../../hooks/useRedeemOnLpBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useStakedBalanceOnLpBoardroom from '../../hooks/useStakedBalanceOnLpBoardroom';
import useWithdrawFromBoardroom from '../../hooks/useWithdrawFromBoardroom';
import useWithdrawFromLpBoardroom from '../../hooks/useWithdrawFromLpBoardroom';

import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import Stat from './components/Stat';
import ProgressCountdown from './components/ProgressCountdown';
import AllocateSeigniorage from './components/AllocateSeigniorage';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAmount from '../../hooks/useTreasuryAmount';
import Humanize from 'humanize-plus';
import { getBalance } from '../../utils/formatBalance';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useCanAllocateSeigniorage from '../../hooks/useCanAllocateSeigniorage';
import Notice from '../../components/Notice';
import useBoardroomVersion from '../../hooks/useBoardroomVersion';
import moment from 'moment';
import background_4 from '../../assets/img/background_4.jpg';

const Boardroom: React.FC = () => {
  // useEffect(() => window.scrollTo(0, 0));
  const { account ,connect} = useWallet();
  const { onRedeem } = useRedeemOnBoardroom();
  const { onLpRedeem } = useRedeemOnLpBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const stakedLpBalance = useStakedBalanceOnLpBoardroom();
  const { canWithdraw } = useWithdrawFromBoardroom();
  const { canWithdrawLp } = useWithdrawFromLpBoardroom();

  const cashStat = useCashPriceInEstimatedTWAP();
  const treasuryAmount = useTreasuryAmount();
  const scalingFactor = useMemo(
    () => (cashStat ? Number(cashStat.priceInDAI).toFixed(2) : null),
    [cashStat],
  );
  const { prevAllocation, nextAllocation } = useTreasuryAllocationTimes();
  const canAllocateSeigniorage = useCanAllocateSeigniorage();

  const prevEpoch = useMemo(
    () =>
      nextAllocation.getTime() <= Date.now()
        ? moment().utc().startOf('hour').toDate()
        : prevAllocation,
    [prevAllocation, nextAllocation],
  );
  const nextEpoch = useMemo(() => moment(prevEpoch).add(12, 'hour').toDate(), [prevEpoch]);

  const boardroomVersion = useBoardroomVersion();
  // const usingOldBoardroom = boardroomVersion !== 'latest';
  const migrateNotice = useMemo(() => {
    if (boardroomVersion === 'v2') {
      return (
        <StyledNoticeWrapper>
          <Notice color="green">
            <b>Please Migrate into New Boardroom</b>
            <br />
            The boardroom upgrade was successful. Please settle and withdraw your stake from the
            legacy boardroom, then stake again on the new boardroom contract{' '}
            <b>to continue earning GOC seigniorage.</b>
          </Notice>
        </StyledNoticeWrapper>
      );
    }
    return <></>;
  }, [boardroomVersion]);

  const isLaunched = Date.now() >= config.boardroomLaunchesAt.getTime();
  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            // icon={<img src={require("../../assets/img/boardroom.png")} width="50%" height="95%" alt="boardroom"/>}
            title="加入董事会"
            subtitle="存入GoCash股份赚取通胀奖励"
          />
          <LaunchCountdown
            deadline={config.boardroomLaunchesAt}
            description="我们是怎样工作的?"
            descriptionLink="https://docs.basis.cash/mechanisms/stabilization-mechanism#expansionary-policy"
          />
        </Page>
      </Switch>
    );
  }
  return (
    <>
    <Background/>
    <Switch>
      <Page>
        {!!account ? (
          <>
            <PageHeader
              // icon={<img src={require("../../assets/img/boardroom.png")} width="45%" height="90%" alt="boardroom"/>}
              title="加入董事会"
              subtitle="存入GoCash股份赚取通胀奖励"
            />
            {migrateNotice}
            <StyledHeader>
            {canAllocateSeigniorage ? (<AllocateSeigniorage
              
            />):(
              <ProgressCountdown
                base={prevEpoch}
                deadline={nextEpoch}
                description="下一通胀周期"
              />
            )}
              <Stat
                icon={<img src={require("../../assets/img/boardroom_price.png")} width="100%" height="100%" alt="boardroom_price"/>}
                title={cashStat ? `$${cashStat.priceInDAI}` : '-'}
                description="GOC 价格 (TWAP)"
              />
              <Stat
                icon={<img src={require("../../assets/img/boardroom_factor.png")} width="100%" height="100%" alt="boardroom_factor"/>}
                title={scalingFactor ? `x${scalingFactor}` : '-'}
                description="比例因子"
              />
              <Stat
                icon={<img src={require("../../assets/img/boardroom_treasury.png")} width="100%" height="100%" alt="boardroom_treasury"/>}
                title={
                  treasuryAmount
                    ? `~$${Humanize.compactInteger(getBalance(treasuryAmount), 2)}`
                    : '-'
                }
                description="国库金额"
              />
            </StyledHeader>
            <StyledBoardroom>
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <LpHarvest />
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <LpStake />
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer size="lg" />
              {canWithdrawLp && (<><div>
                <Button
                  disabled={stakedLpBalance.eq(0)}
                  onClick={onLpRedeem}
                  text="取出本金和收益"
                />
              </div>
                <Spacer size="lg" /></>)}
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <Harvest />
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Stake />
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer size="lg" />
              {canWithdraw && (<><div>
                <Button
                  disabled={stakedBalance.eq(0)}
                  onClick={onRedeem}
                  text="取出本金和收益"
                />
              </div>
                <Spacer size="lg" /></>)}
            </StyledBoardroom>
            <StyledLink href="https://goswap.app/#/add/0x3bb34419a8E7d5E5c68B400459A8eC1AFfe9c56E/0x0298c2b32eae4da002a15f36fdf7615bea3da047" target="_blank">
            <StyledIcon>{<img src={require("../../assets/img/gocash.png")} width="80%" height="80%" alt="gocash"  style={{position:"relative",top:"-5px"}}/>}</StyledIcon>
              {`  在GoSwap为GOS-HUSD LP交易对提供流动性   `}
              <StyledIcon>{<img src={require("../../assets/img/gocash.png")} width="80%" height="80%" alt="gocash" style={{position:"relative",top:"-5px"}}/>}</StyledIcon>
            </StyledLink>
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
            <Button onClick={() => connect('injected')} text="解锁钱包" />
          </div>
        )}
      </Page>
    </Switch>
    </>
  );
};

const Background = styled.div`
background: url(${background_4});
background-repeat: no-repeat;
width: 100%;
background-size: 100% auto;
z-index: -3;
height: 100%;
position: fixed;
  }
`;
const StyledIcon = styled.div`
  font-size: 28px;
  width:24px;
  height:24px;
  padding-left:10px;
  padding-right:5px;
`;
const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  display: inherit;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledHeader = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 960px;

  > * {
    flex: 1;
    height: 84px;
    margin: 10px ${(props) => props.theme.spacing[2]}px;
  }

  @media (max-width: 835px) {
    flex-direction: column;
    width: 80%;
  }
`;

const StyledNoticeWrapper = styled.div`
  width: 768px;
  margin-top: -20px;
  margin-bottom: 40px;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

// const Center = styled.div`
//   display: flex;
//   flex: 1;
//   align-items: center;
//   justify-content: center;
// `;

export default Boardroom;
