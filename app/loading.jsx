import { BlinkBlur } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50 z-50">
      <BlinkBlur />
    </div>
  );
}
