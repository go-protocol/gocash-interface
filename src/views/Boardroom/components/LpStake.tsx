import React, { useMemo } from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useBasisCash from '../../../hooks/useBasisCash';
import useStakedBalanceOnLpBoardroom from '../../../hooks/useStakedBalanceOnLpBoardroom';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToLpBoardroom from '../../../hooks/useStakeToLpBoardroom';
import useWithdrawFromLpBoardroom from '../../../hooks/useWithdrawFromLpBoardroom';
// import useRedeemOnLpBoardroom from '../../../hooks/useRedeemOnLpBoardroom';
import moment from 'moment';

const Stake: React.FC = () => {
  const basisCash = useBasisCash();
  // const boardroomVersion = useBoardroomVersion();
  const [approveStatus, approve] = useApprove(
    basisCash.GOSLP,
    basisCash.boardroomByVersion('lp').address,
  );
  const tokenBalance = useTokenBalance(basisCash.GOSLP);
  const stakedBalance = useStakedBalanceOnLpBoardroom();
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const { onStake } = useStakeToLpBoardroom();
  const { onWithdraw, canWithdrawLp,canWithdrawTime} = useWithdrawFromLpBoardroom();// eslint-disable-line no-unused-vars
  // const { onLpRedeem } = useRedeemOnLpBoardroom('Redeem BAS for Boardroom Migration');
  const withdrawUnix = canWithdrawTime.toNumber() - moment().unix();
  const withdrawHour = Math.floor(withdrawUnix / 3600)
  const withdrawMinus = Math.floor((withdrawUnix - withdrawHour * 3600) / 60);

  const withdrawTime = useMemo(() => withdrawUnix > 0 && withdrawHour + "小时" + withdrawMinus + "分钟后可以取款", [withdrawHour,withdrawMinus]);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'GOS-HUSD LP'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'GOS-HUSD LP'}
    />,
  );

  return (
    <StyledCardWrapper>
          <StyledCardSuperAccent />
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="GOS" />
            </CardIcon>
            <Value value={getDisplayBalance(stakedBalance)} />
            <Label text="GOS-HUSD LP质押" />
            {!canWithdrawLp && (
                    <Label text={withdrawTime} />
            )}
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                onClick={approve}
                text="批准GOS-HUSD LP"
              />
            ) : (
                <>
                {canWithdrawLp && (
                    <div>
                    <IconButton onClick={onPresentWithdraw}>
                      <RemoveIcon />
                    </IconButton>
                  <StyledActionSpacer /></div>
                  ) }
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon />
                  </IconButton>
                </>
              )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
    </StyledCardWrapper>
  );
};

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
  margin-bottom: 20px;
`;

const StyledCardSuperAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  border-radius: 12px;
  filter: blur(8px);
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  z-index: -1;
`; // eslint-disable-line no-unused-vars

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
