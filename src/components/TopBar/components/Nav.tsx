import React from 'react'
import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Nav: React.FC = () => {
  const { t } = useTranslation()
  return (
    <StyledNav>
      <StyledLink exact={t("gocash")==="Home"} activeClassName="active" to="/">{t("gocash")}</StyledLink>
      <StyledLink exact={t("gocash")==="Home"} activeClassName="active" to="/bank">{t("bank")}</StyledLink>
      <StyledLink exact={t("gocash")==="Home"} activeClassName="active" to="/bonds">{t("bonds")}</StyledLink>
      <StyledLink exact={t("gocash")==="Home"} activeClassName="active" to="/boardroom">{t("boardroom")}</StyledLink>
      <StyledLink2 ping={t("gocash")} href="https://heco.vote/#/gocash.heco" target="_blank">{t("vote")}</StyledLink2>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  @media (max-width: 835px) {
    font-size: 23px;
  }
`

const StyledLink = styled(NavLink)`
  color: ${props => props.theme.color.grey[400]};
  font-weight: 700;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  ${props => {
    console.log(props.exact)
    if (props.exact) {
      return css`
      @media (max-width: 835px) {
        padding-left:10px;
        padding-right: 0;
      }
        `
    } 
  }
  }
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
  &.active {
    color: ${props => props.theme.color.primary.main};
  }
`
const StyledLink2 = styled.a`
  color: ${props => props.theme.color.grey[400]};
  font-weight: 700;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  ${props => {
    if (props.ping==="Home") {
      return css`
      @media (max-width: 835px) {
        padding-left:10px;
        padding-right: 0;
      }
        `
    } 
  }
  }
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`

export default Nav