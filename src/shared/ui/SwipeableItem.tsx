import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function SwipeableItem({
  children,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTranslateX(-128);
    } else {
      setTranslateX(0);
    }
  }, [isOpen]);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      let x = Math.min(0, e.deltaX);
      x = Math.max(x, -128);
      setTranslateX(x);
    },
    onSwiped: (e) => {
      if (e.deltaX < -60) {
        setTranslateX(-128);
        onOpen();
      } else {
        setTranslateX(0);
        onClose();
      }
    },
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="will-change-transform"
      style={{
        transform: `translate3d(${isOpen ? -128 : translateX}px, 0, 0)`,
        transition: isOpen ? "transform 0.2s ease-out" : "none",
      }}
    >
      {children}
    </div>
  );
}