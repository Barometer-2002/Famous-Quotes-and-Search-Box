import React from 'react';

export enum SearchEngineType {
  GOOGLE = 'google',
  BING = 'bing',
  BAIDU = 'baidu',
  DUCKDUCKGO = 'duckduckgo',
  BILIBILI = 'bilibili',
  GEMINI = 'gemini'
}

export interface SearchEngine {
  type: SearchEngineType;
  name: string;
  icon: React.ComponentType<any>;
  urlTemplate: string;
  placeholder: string;
}

export interface Quote {
  text: string;
  author: string;
}