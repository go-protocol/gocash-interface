import React from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../basis-cash';

const Bank: React.FC = () => {
  // useEffect(() => window.scrollTo(0, 0));

  const { bankId } = useParams();
  const bank = useBank(bankId);
  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);

  return account && bank ? (
    <>
      <PageHeader
        icon={<img src={require("../../assets/img/bank.png")} width="80%" height="90%" alt="banks" style={{position: "absolute",top: "5%",left:"10%"}}/>}
        subtitle={`存入 ${bank?.depositTokenName} 赚取 ${bank?.earnTokenName}`}
        title={bank?.name}
      />
      <StyledBank>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest bank={bank} />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake bank={bank} />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
         <LPTokenHelpText bank={bank} />
        <Spacer size="lg" />
        <div>
          <Button onClick={onRedeem} text="取出本金和收益" />
        </div>
        <Spacer size="lg" />
      </StyledBank>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  return (
    <StyledLink href={bank.pairUrl} target="_blank">
       <StyledIcon>{<img src={require("../../assets/img/gocash.png")} width="80%" height="80%" alt="gocash"  style={{position:"relative",top:"-5px"}}/>}</StyledIcon>
      {`  在GoSwap为 ${bank.pairName} 交易对提供流动性  `}
      <StyledIcon>{<img src={require("../../assets/img/gocash.png")} width="80%" height="80%" alt="gocash"  style={{position:"relative",top:"-5px"}}/>}</StyledIcon>
    </StyledLink>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader
        icon="🏚"
        title="没有赛道"
        subtitle="目前所有的赛道禁行"
      />
    </Center>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="解锁钱包" />
    </Center>
  );
};
const StyledIcon = styled.div`
  font-size: 28px;
  width:24px;
  height:24px;
  padding-left:10px;
  padding-right:5px;
`;
const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// const StyledUniswapLPGuide = styled.div`
//   margin: -24px auto 48px;
// `;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  display: inherit;
  color: ${(props) => props.theme.color.primary.main};
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

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
