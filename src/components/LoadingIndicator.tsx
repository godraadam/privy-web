import { usePromiseTracker } from "react-promise-tracker";
import { BarLoader } from "react-spinners";

export default function LoadingIndicator() {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress ? 
      <div className="flex align-center justify-center">
        <BarLoader color="#ffffff" loading={true} width={150} height={5} />
      </div>
      :
      <></>
  );
}
