import React from 'react';
import styled from 'styled-components';
import Card from '../../../components/Card';

interface StatProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Stat: React.FC<StatProps> = ({ icon, title, description }) => {
  return (
    <Card>
      <StyledCardContentInner>
        <StyledIcon>{icon}</StyledIcon>
        <StyledTextWrapper>
          <StyledCardTitle>{title}</StyledCardTitle>
          <StyledDesc>{description}</StyledDesc>
        </StyledTextWrapper>
      </StyledCardContentInner>
    </Card>
  );
};

const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 18px;
  font-weight: 700;
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[400]};
`;

const StyledIcon = styled.div`
  font-size: 28px;
  width:56px;
  margin-right: 10px;
`;

const StyledTextWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  @media (max-width: 835px) {
    margin-top:10px;
  }
  flex-direction: row;
  padding: ${(props) => props.theme.spacing[2]}px ${(props) => props.theme.spacing[4]}px;
`;

export default Stat;
