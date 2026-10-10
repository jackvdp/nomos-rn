import { useReducedMotion } from '@nomos/ui';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, type ComponentProps } from 'react';

// The last frame of every drawing.
const lastFrame = 150;

export interface DrawingProps {
  /** One of the Lottie files in `assets/lottie`. */
  source: ComponentProps<typeof LottieView>['source'];
  /** Width and height. */
  size: number;
  /** The drawing plays from the start each time this becomes true. Defaults to true. */
  playing?: boolean;
}

/**
 * A line drawing that draws itself once and holds its last frame. It is
 * decoration: hide it from screen readers where it is used.
 */
export function Drawing({ source, size, playing = true }: DrawingProps) {
  const reducedMotion = useReducedMotion();
  const lottie = useRef<LottieView>(null);

  useEffect(() => {
    if (!playing) return;
    if (reducedMotion) {
      lottie.current?.pause();
    } else {
      lottie.current?.play(0, lastFrame);
    }
  }, [playing, reducedMotion]);

  return (
    <LottieView
      ref={lottie}
      source={source}
      loop={false}
      // With reduced motion the finished drawing shows from the start.
      progress={reducedMotion ? 1 : undefined}
      style={{ width: size, height: size }}
    />
  );
}
