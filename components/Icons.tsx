import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const IconImage: React.FC<IconProps & { src: string; alt: string }> = ({ size = 24, src, alt, className, style }) => (
  <img 
    src={src} 
    alt={alt} 
    className={`object-contain select-none ${className || ''}`}
    style={{ width: size, height: size, ...style }} 
    draggable={false}
  />
);

export const GoogleIcon: React.FC<IconProps> = (props) => (
  <IconImage {...props} src="https://www.google.com/s2/favicons?domain=google.com&sz=128" alt="Google" />
);

export const BaiduIcon: React.FC<IconProps> = (props) => (
  <IconImage {...props} src="https://www.google.com/s2/favicons?domain=baidu.com&sz=128" alt="Baidu" />
);

export const BingIcon: React.FC<IconProps> = (props) => (
  <IconImage {...props} src="https://www.google.com/s2/favicons?domain=bing.com&sz=128" alt="Bing" />
);

export const BilibiliIcon: React.FC<IconProps> = (props) => (
  <IconImage {...props} src="https://www.google.com/s2/favicons?domain=bilibili.com&sz=128" alt="Bilibili" />
);

export const GeminiIcon: React.FC<IconProps> = (props) => (
  <IconImage {...props} src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="Gemini" />
);

export const DuckDuckGoIcon: React.FC<IconProps> = (props) => (
  <IconImage {...props} src="https://www.google.com/s2/favicons?domain=duckduckgo.com&sz=128" alt="DuckDuckGo" />
);
