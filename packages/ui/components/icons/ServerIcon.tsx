const ServerIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path d="M11.875 8.125L13.75 10L11.875 11.875M8.125 11.875L6.25 10L8.125 8.125M5 16.875H15C16.0355 16.875 16.875 16.0355 16.875 15V5C16.875 3.96447 16.0355 3.125 15 3.125H5C3.96447 3.125 3.125 3.96447 3.125 5V15C3.125 16.0355 3.96447 16.875 5 16.875Z" stroke="#0C4A6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

ServerIcon.displayName = 'ServerIcon';

export default ServerIcon