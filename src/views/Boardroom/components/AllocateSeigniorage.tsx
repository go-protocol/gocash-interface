import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Button';
import useAllocateSeigniorage from '../../../hooks/useAllocateSeigniorage';


const ProgressCountdown: React.FC = () => {
  const { onAllocateSeigniorage } = useAllocateSeigniorage();
  const { t } = useTranslation()
  return (
    <Button onClick={onAllocateSeigniorage} text={t("seigniorage")}>

    </Button>
  );
};

export default ProgressCountdown;
