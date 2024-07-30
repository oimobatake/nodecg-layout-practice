import React from 'react';
import { createRoot } from 'react-dom/client';
import CountDownTimer from './CountDownTimer';

const root = createRoot(document.getElementById('root')!);
root.render(<CountDownTimer />);
