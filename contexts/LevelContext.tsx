import { createContext } from 'react';

export const LevelContext = createContext<{ level: string; setLevel: (level: string) => void }>({
  level: 'Universidad (Grado)',
  setLevel: () => {},
});
