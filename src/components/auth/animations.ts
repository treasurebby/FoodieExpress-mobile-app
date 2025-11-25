import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useFadeIn(duration = 450, delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });
    a.start();
  }, [opacity, duration, delay]);
  return opacity;
}

export function useScaleOnPress(initial = 1, pressed = 0.96) {
  const scale = useRef(new Animated.Value(initial)).current;

  const down = () => {
    Animated.spring(scale, { toValue: pressed, useNativeDriver: true, friction: 8 }).start();
  };
  const up = () => {
    Animated.spring(scale, { toValue: initial, useNativeDriver: true, friction: 8 }).start();
  };

  return { scale, down, up } as const;
}
