'use client'

import dynamic from 'next/dynamic';
import { AsyncAPIStudio } from './studio';

import { useState, type FunctionComponent } from 'react';

export default function App() {
  return (
    <AsyncAPIStudio />
  );
};