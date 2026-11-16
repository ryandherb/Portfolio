import { createContext } from 'react';

export const RunContext = createContext<(command: string) => void>(() => {});
