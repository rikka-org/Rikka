import * as React from "react";

export const Scale = React.memo(
  (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path
      fill="currentColor"
      d="M26 30C26 35.524 30.476 40 36 40C41.524 40 46 35.524 46 30H26Z M12 40C17.524 40 22 35.524 22 30H2C2 35.524 6.476 40 12 40Z M26 16V14H33.312L29.112 28H33.29L36 18.962L38.71 28H42.888L38.688 14H44V10H26V6H22V10H4V14H9.312L5.112 28H9.288L12 18.962L14.712 28H18.888L14.688 14H22V16H26Z"
    />
  </svg>,
);
