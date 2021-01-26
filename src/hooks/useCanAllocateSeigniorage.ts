import { useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';

const useCanAllocateSeigniorage = () => {
  const [canAllocateSeigniorage, setCanAllocateSeigniorage] = useState<Boolean>();
  const basisCash = useBasisCash();

  useEffect(() => {
    if (basisCash) {
      basisCash.canAllocateSeigniorage().then(setCanAllocateSeigniorage);
    }
  }, [basisCash]);
  return canAllocateSeigniorage;
};

export default useCanAllocateSeigniorage;
