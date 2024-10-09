import React from 'react';
import { DatabaseProvider } from './DatabaseContext';

/**
 * DatabaseLayout wraps children with DatabaseProvider.
 */
export default function DatabaseLayout({ children }) {
  return (
    <DatabaseProvider>
      {children}
    </DatabaseProvider>
  );
}