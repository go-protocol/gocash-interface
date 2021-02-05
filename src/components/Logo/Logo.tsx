import React from 'react';
import styled from 'styled-components';

import farmer from '../../assets/img/farmer.png';

const Logo: React.FC = () => {
  return (
    <StyledLogo>
      <img src={farmer} height="32" style={{ marginTop: -4 }} alt=""/>
      <StyledLink href="/">GoCash</StyledLink>
    </StyledLogo>
  );
};

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
`;

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[100]};
  text-decoration: none;
  font-size: 18px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[2]}px;
  @media (max-width: 835px) {
    font-size: 23px;
  }
`;

export default Logo;
