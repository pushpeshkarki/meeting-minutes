import type { AppProps } from 'next/app';
import { OllamaSetup } from '../components/OllamaSetup';
import React from 'react';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <OllamaSetup />
      <Component {...pageProps} />
    </>
  );
}

export default App; 