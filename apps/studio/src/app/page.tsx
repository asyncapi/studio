'use client'

import '../components/styles/global.css';
import '../components/styles/main.css';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import '@asyncapi/react-component/styles/default.min.css';
import 'reactflow/dist/style.css';

import { AsyncAPIStudio } from '../components/Studio';

export default function App() {
  return (
    <AsyncAPIStudio />
  );
};