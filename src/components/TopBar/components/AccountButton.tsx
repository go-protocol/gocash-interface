import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useWallet } from 'use-wallet';

import useModal from '../../../hooks/useModal';

import Button from '../../Button';

import AccountModal from './AccountModal';

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<AccountModal />)
  const { t } = useTranslation()
  const { account, connect } = useWallet()

  return (
    <StyledAccountButton>
      {!account ? (
        <Button
          onClick={() => connect('injected')}
          size="sm"
          text={t("unlockwallet")}
        />
      ) : (
        <Button
          onClick={onPresentAccountModal}
          size="sm"
          text={t("mywallet")}
        />
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div`
@media (max-width: 835px) {
  font-size: 25px;
}
`

export default AccountButton