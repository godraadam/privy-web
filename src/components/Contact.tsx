import { useNavigate } from "react-router-dom";
import { PrivyContact } from "../models/privyContact";

interface ContactProps {
  index: number;
  contact: PrivyContact;
  onClick: () => void;
}

export default function Contact(props: ContactProps) {
  const navigate = useNavigate();

  function onShowProfile() {
    navigate(
      `/profile/?username=${props.contact.alias}&pubkey=${encodeURIComponent(props.contact.pubkey)}`
    );
  }

  return (
    <li
      className=" w-full max-w-md"
      onClick={props.onClick}
      key={props.index}
    >
      <div className="flex flex-row gap-3 justify-between items-center hover:bg-stone-600 rounded-full px-4 py-2">
        {props.contact.alias}
        <svg
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 24 24"
          height={24}
          width={24}
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onShowProfile}
        >
          <path
            d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8c-.414 0-.75.336-.75.75v5.5c0 .414.336.75.75.75s.75-.336.75-.75v-5.5c0-.414-.336-.75-.75-.75zm-.002-3c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z"
            fill-rule="nonzero"
          />
        </svg>
      </div>
      <div className="divider"></div>
    </li>
  );
}
