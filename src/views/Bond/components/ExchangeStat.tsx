import React from 'react';
import styled from 'styled-components';
import Card from '../../../components/Card';

interface ExchangeStatProps {
  tokenName: string;
  description: string;
  price: string;
}

const ExchangeStat: React.FC<ExchangeStatProps> = ({ tokenName, description, price }) => {
  return (
    <Card>
      <StyledCardContentInner>
        <StyledCardTitle>
        <StyledIcon>{<img src={require("../../../assets/img/bond_price.png")} width="80%" height="100%" alt="bond_price"/>}</StyledIcon>
          {` ${tokenName} = $${price}`}</StyledCardTitle>
        <StyledDesc>{description}</StyledDesc>
      </StyledCardContentInner>
    </Card>
  );
};

const StyledIcon = styled.div`
  font-size: 28px;
  width:40px;
  height:40px;
`;
const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 20px;
  font-weight: 700;
  display: inherit;
  line-height: 40px;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[300]};
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]}px;
`;

export default ExchangeStat;
