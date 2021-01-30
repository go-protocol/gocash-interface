import React, { useMemo }from 'react';
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
import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToBoardroom from '../../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';
import useBoardroomVersion from '../../../hooks/useBoardroomVersion';
// import useRedeemOnBoardroom from '../../../hooks/useRedeemOnBoardroom';
import moment from 'moment';

const Stake: React.FC = () => {
  const basisCash = useBasisCash();
  const boardroomVersion = useBoardroomVersion();
  const [approveStatus, approve] = useApprove(
    basisCash.GOS,
    basisCash.boardroomByVersion(boardroomVersion).address,
  );

  const tokenBalance = useTokenBalance(basisCash.GOS);
  const stakedBalance = useStakedBalanceOnBoardroom();
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const { onStake } = useStakeToBoardroom();
  const { onWithdraw, canWithdraw,canWithdrawTime  } = useWithdrawFromBoardroom();// eslint-disable-line no-unused-vars
  // const { onRedeem } = useRedeemOnBoardroom('Redeem BAS for Boardroom Migration');
  const withdrawUnix = canWithdrawTime.toNumber() - moment().unix();
  const withdrawHour = Math.floor(withdrawUnix / 3600)
  const withdrawMinus = Math.floor((withdrawUnix - withdrawHour * 3600) / 60);

  const withdrawTime = useMemo(() => withdrawHour> 0 && withdrawHour + "小时" + withdrawMinus + "分钟后可以取款", [withdrawHour,withdrawMinus]);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'GoCash 股份'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'GoCash股份GOS'}
    />,
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="GOS" />
            </CardIcon>
            <Value value={getDisplayBalance(stakedBalance)} />
            <Label text="GoCash股份GOS质押" />
            {!canWithdraw && (
                    <Label text={withdrawTime} />
            )}
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                onClick={approve}
                text="批准GoCash股份GOS"
              />
            ) : (
                <>
                  {canWithdraw && (
                    <div>
                    <IconButton onClick={onPresentWithdraw}>
                      <RemoveIcon />
                    </IconButton>
                  <StyledActionSpacer /></div>
                  )}
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon />
                  </IconButton>
                </>
              )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

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
