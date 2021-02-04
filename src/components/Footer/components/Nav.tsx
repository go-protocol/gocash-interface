import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href= {buyGOS} target="_blank">获取GoCash股份GOS</StyledLink>
      <StyledLink href= {buyGOC} target="_blank">获取GoCash现金GOC</StyledLink>
      <StyledLink href="https://github.com/go-protocol/gocash-core" target="_blank">GitHub</StyledLink>
      {/* <StyledLink href="https://twitter.com/BasisCash" target="_blank">Twitter</StyledLink>
      <StyledLink href="https://t.me/basiscash" target="_blank">Telegram</StyledLink>
      <StyledLink href="https://discord.gg/UEZq3HF5Eu" target="_blank">Discord</StyledLink>
      <StyledLink href="https://medium.com/basis-cash" target="_blank">Medium</StyledLink> */}
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`
const buyGOS ="https://www.goswap.app/#/swap?inputCurrency=0x0298c2b32eae4da002a15f36fdf7615bea3da047&outputCurrency=0x3bb34419a8E7d5E5c68B400459A8eC1AFfe9c56E";
const buyGOC= "https://www.goswap.app/#/swap?inputCurrency=0x0298c2b32eae4da002a15f36fdf7615bea3da047&outputCurrency=0x271B54EBe36005A7296894F819D626161C44825C"
export default Nav