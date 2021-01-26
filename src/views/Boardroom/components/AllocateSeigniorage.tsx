import React from 'react';
import Button from '../../../components/Button';
import useAllocateSeigniorage from '../../../hooks/useAllocateSeigniorage';


const ProgressCountdown: React.FC = () => {
  const { onAllocateSeigniorage } = useAllocateSeigniorage();
  return (
    <Button onClick={onAllocateSeigniorage} text="分配铸币税">

    </Button>
  );
};

export default ProgressCountdown;
