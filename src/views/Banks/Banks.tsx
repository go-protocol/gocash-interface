import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Bank from '../Bank';
import BankCards from './BankCards';
import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import styled from 'styled-components';
import background_2 from '../../assets/img/background_2.jpg';

const Banks: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();

  return (
    <Background>
    <Switch>
      <Page>
        <Route exact path={path}>
          <PageHeader
            // icon={<img src={require("../../assets/img/banks.png")} width="100%" height="48%" alt="banks" style={{position: "absolute",top: "35%",left:"0"}}/>}
            title="选择一条赛道."
            subtitle="通过提供GoSwap流动性赚取收益"
          />
          {!!account ? (
            <BankCards />
          ) : (
            <Center>
              <Button onClick={() => connect('injected')} text="解锁钱包" />
            </Center>
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <Bank />
        </Route>
      </Page>
    </Switch>
    </Background>
  );
};

const Background = styled.div`
background: url(${background_2});
background-repeat: no-repeat;
width: 100%;
background-size: 100% auto;
z-index: -3;
height: 100%;
position: fixed;
  }
`;
const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Banks;
