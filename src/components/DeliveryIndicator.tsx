import { BeatLoader } from "react-spinners";

interface DeliveryIndicatorProps {
  delivered: "delivered" | "failed" | "undetermined";
}

export default function DeliveryIndicator(props: DeliveryIndicatorProps) {
  console.log(props.delivered);
  switch (props.delivered) {
    case "delivered":
     return <></>
    case "failed":
      return (
        <span
          className="indicator-item indicator-bottom badge p-0"
          title="failed to deliver"
        >
          <svg
            clip-rule="evenodd"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="indianred"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8.933-2.721-2.722c-.146-.146-.339-.219-.531-.219-.404 0-.75.324-.75.749 0 .193.073.384.219.531l2.722 2.722-2.728 2.728c-.147.147-.22.34-.22.531 0 .427.35.75.751.75.192 0 .384-.073.53-.219l2.728-2.728 2.729 2.728c.146.146.338.219.53.219.401 0 .75-.323.75-.75 0-.191-.073-.384-.22-.531l-2.727-2.728 2.717-2.717c.146-.147.219-.338.219-.531 0-.425-.346-.75-.75-.75-.192 0-.385.073-.531.22z"
              fill-rule="nonzero"
            />
          </svg>
        </span>
      );
    case "undetermined":
      return (
        <span
          className="indicator-item indicator-bottom badge p-0"
          title="delivering..."
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 0c-6.623 0-12 5.377-12 12s5.377 12 12 12 12-5.377 12-12-5.377-12-12-12zm0 22c-5.519 0-10-4.48-10-10 0-5.519 4.481-10 10-10 5.52 0 10 4.481 10 10 0 5.52-4.48 10-10 10z" />
          </svg> */}
          <BeatLoader color="#ffffff" loading={true} size = {3}/>
        </span>
      );
  }
}
