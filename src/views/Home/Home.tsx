import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import HomeCard from './components/HomeCard';
import { OverviewData } from './types';
import useBasisCash from '../../hooks/useBasisCash';
import config from '../../config';
import background_1 from '../../assets/img/background_1.jpg';
import { useTranslation } from 'react-i18next';
// import Notice from '../../components/Notice';

const Home: React.FC = () => {
  const basisCash = useBasisCash();
  const { t } = useTranslation()
  const [{ cash, bond, share }, setStats] = useState<OverviewData>({});
  const fetchStats = useCallback(async () => {
    const [cash, bond, share] = await Promise.all([
      basisCash.getCashStatFromUniswap(),
      basisCash.getBondStat(),
      basisCash.getShareStat(),
    ]);
    if (Date.now() < config.bondLaunchesAt.getTime()) {
      bond.priceInDAI = '-';
    }else{
      bond.priceInDAI = (Math.floor(Number(bond.priceInDAI) * 100) / 100).toString()
    }
    setStats({ cash, bond, share });
  }, [basisCash, setStats]);

  useEffect(() => {
    if (basisCash) {
      fetchStats().catch((err) => console.error(err.stack));
    }
  }, [basisCash,fetchStats]);

  const cashAddr = useMemo(() => basisCash?.GOC.address, [basisCash]);
  const shareAddr = useMemo(() => basisCash?.GOS.address, [basisCash]);
  const bondAddr = useMemo(() => basisCash?.GOB.address, [basisCash]);

  return (
    <Background>
    <Page>
      <PageHeader
        // icon={<img src={require("../../assets/img/goCash (3).png")} width="80%" alt="goCash" height="100%"/>}
        subtitle={t("homesubtitle1")}
        title={t("hometitle1")}
      />
      <Spacer size="md" />
      <CardWrapper>
        <HomeCard
          title={t("hometitle2")}
          symbol="GOC"
          color="#EEA7ED"
          supplyLabel={t("totalsupply")}
          address={cashAddr}
          stat={cash}
        />
        <Spacer size="lg" />
        <HomeCard
          title={t("hometitle3")}
          symbol="GOS"
          color="#E83725"
          supplyLabel={t("totalsupply")}
          address={shareAddr}
          stat={share}
        />
        <Spacer size="lg" />
        <HomeCard
          title={t("hometitle4")}
          symbol="GOB"
          color="#ECF25C"
          supplyLabel={t("totalsupply")}
          address={bondAddr}
          stat={bond}
        />
      </CardWrapper>
    </Page>
    </Background>
  );
};

// const StyledOverview = styled.div`
//   align-items: center;
//   display: flex;
//   @media (max-width: 768px) {
//     width: 100%;
//     flex-flow: column nowrap;
//     align-items: center;
//   }
// `;

const Background = styled.div`
background: url(${background_1});
background-size: cover;
background-repeat: no-repeat;
  }
`;
const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

// const StyledNoticeContainer = styled.div`
//   max-width: 768px;
//   width: 90vw;
// `;

// const StyledSpacer = styled.div`
//   height: ${(props) => props.theme.spacing[4]}px;
//   width: ${(props) => props.theme.spacing[4]}px;
// `;

// const StyledLink = styled.a`
//   font-weight: 700;
//   text-decoration: none;
//   color: ${(props) => props.theme.color.primary.main};
// `;

export default Home;
