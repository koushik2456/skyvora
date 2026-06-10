import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface Props {
  text: string;
  speed?: number;
  style?: TextStyle | TextStyle[];
  startDelay?: number;
}

export default function TypewriterText({ text, speed = 55, style, startDelay = 0 }: Props) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return <Text style={style}>{shown}</Text>;
}
