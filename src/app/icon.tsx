import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}
      >
        <path
          d="M16 2L4 7v9c0 7.2 5.1 13.3 12 15 6.9-1.7 12-7.8 12-15V7L16 2z"
          fill="#0A0A0D"
          stroke="#C99A4A"
          strokeWidth="1.5"
        />
        <path
          d="M12 16l3 3 5-6"
          fill="none"
          stroke="#C99A4A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    { ...size }
  );
}
