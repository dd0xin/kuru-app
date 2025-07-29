/// <reference types="vite/client" />
import type { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: ethers.providers.ExternalProvider
    }
}