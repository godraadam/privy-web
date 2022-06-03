import { usePromiseTracker } from "react-promise-tracker";
import { BarLoader } from "react-spinners";

interface LoadingIndicatorProps {
  width: number
}

export default function LoadingIndicator(props: LoadingIndicatorProps) {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress ? 
      <div className="flex align-center justify-center flex-grow">
        <BarLoader color="#ffffff" loading={true} height={2}/>
      </div>
      :
      <></>
  );
}
