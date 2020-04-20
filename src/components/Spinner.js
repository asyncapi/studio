export default function Spinner() {
  return (
    <>
      <style jsx global>{`
        @-webkit-keyframes rotate {
          0% {
            -webkit-transform:rotate(0);
            transform:rotate(0)
          }
          50% {
            -webkit-transform:rotate(180deg);
            transform:rotate(180deg)
          }
          100% {
            -webkit-transform:rotate(360deg);
            transform:rotate(360deg)
          }
        }
        .ball-clip-rotate-multiple {
          position: relative; }
          .ball-clip-rotate-multiple > div {
            -webkit-animation-fill-mode: both;
                    animation-fill-mode: both;
            position: absolute;
            left: -20px;
            top: -20px;
            border: 2px solid #252f3f;
            border-bottom-color: transparent;
            border-top-color: transparent;
            border-radius: 100%;
            height: 25px;
            width: 25px;
            -webkit-animation: rotate 1s 0s ease-in-out infinite;
                    animation: rotate 1s 0s ease-in-out infinite; }
            .ball-clip-rotate-multiple > div:last-child {
              display: inline-block;
              top: -14px;
              left: -14px;
              width: 12px;
              height: 12px;
              -webkit-animation-duration: 0.5s;
                      animation-duration: 0.5s;
              border-color: #252f3f transparent #252f3f transparent;
              -webkit-animation-direction: reverse;
                      animation-direction: reverse; }
      `}</style>

      <div className="ball-clip-rotate-multiple">
        <div></div>
        <div></div>
      </div>
    </>
  )
}
