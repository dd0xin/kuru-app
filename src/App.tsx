import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers';

import * as sdk from '@kuru-labs/kuru-sdk';
import config from './config.json';

const { rpcUrl, marginAccountAddress } = config;

function App() {
  const [balance, setBalance] = useState<string>('');
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
  const [kuruWalletSigner, setKuruWalletSigner] = useState<ethers.Signer | null>(null);

  const getBalance = useCallback(async () => {
    let balance = '';

    if (!provider) {
      return balance;
    }

    try {
      const result = await sdk.MarginBalance.getBalance(
        provider, marginAccountAddress, '0x44e8b96fc3b9ab63471d35cf136867615b2df333', '0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50'
      )
      balance = ethers.utils.formatUnits(result, 18);
      return balance;
    } catch (error) {
      console.log('Failed to get balance: ', error);
      return balance;
    }
  }, [provider])

  const claim = useCallback(async() => {
    if (!kuruWalletSigner) {
      console.log('No signer found!');
      return;
    }
    try {
      const receipt = await sdk.MarginWithdraw.batchClaimMaxTokens(kuruWalletSigner, marginAccountAddress, [
        '0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50',
      ]);
      console.log('Transaction hash:', receipt.transactionHash);
    } catch (error) {
      console.log('Failed to claim: ', error);
    }
  }, [kuruWalletSigner])

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(import.meta.env.VITE_PRIVET_KEY, provider);

    setProvider(provider);
    setKuruWalletSigner(signer);
  }, [])


  useEffect(() => {
    getBalance().then((balance) => setBalance(balance))
  }, [getBalance])

  return (
    <>
      <h1>Kuru</h1>
      <p>
        Balance <span>{balance} $YAKI on margin account</span>
      </p>
      {kuruWalletSigner && <button onClick={claim}>Claim to wallet</button>}
    </>
  )
}

export default App
