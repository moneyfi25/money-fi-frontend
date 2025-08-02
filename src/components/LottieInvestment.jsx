import Lottie from "lottie-react";
import animationData from "../assets/animation.json";

export default function LottieInvestment({ height = 180, width = 180 }) {
  return (
    <Lottie animationData={animationData} loop autoplay style={{ height, width }} />
  );
}
