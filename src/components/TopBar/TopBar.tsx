import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'
import TxButton from './components/TxButton'

const TopBar: React.FC = () => {
  return (
    <StyledTopBar>
      <Container size="lg">
        <StyledTopBarInner>
          <StyledTopLogo>
            <Logo />
          </StyledTopLogo>
          <Nav />
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <TxButton />
            <AccountButton />
          </div>
        </StyledTopBarInner>
      </Container>
    </StyledTopBar>
  )
}

const StyledTopBar = styled.div`
background: #000;
    opacity: 0.7;
    position: fixed;
    width: 100%;
    z-index: 9999;
    `

    const StyledTopLogo = styled.div`
    flex:1;
    @media (max-width: 835px) {
      flex:0;
    }
        `

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${props => props.theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${props => props.theme.siteWidth}px;
  width: 100%;
  flex-wrap: wrap;
`

export default TopBar