import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import farmer from '../../assets/img/farmer.png';

const Logo: React.FC = () => {
  const { t } = useTranslation()
  return (
    <StyledLogo about={t("gocash")}>
      <img src={farmer} height="32" style={{ marginTop: -4 }} alt=""/>
      <StyledLink href="/">GoCash</StyledLink>
    </StyledLogo>
  );
};

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
  ${props => {
    if (props.about==="Home") {
      return css`
      @media (max-width: 835px) {
       display:none;
      }
        `
    } 
  }
  }
`;

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[100]};
  text-decoration: none;
  font-size: 18px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[2]}px;
  @media (max-width: 835px) {
    display:none;
  }
`;

export default Logo;
