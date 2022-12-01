import type { FunctionComponent } from 'react';

interface SurveyPopoverProps {}

export const SurveyPopover: FunctionComponent<SurveyPopoverProps> = () => {
  return null;

  // const editorState = state.useEditorState();
  // const editorLoaded = editorState.editorLoaded.get();
  // const [show, setShow] = useState(false);

  // useEffect(() => {
  //   if (localStorage.getItem('show:survey') === 'false') return;
  //   if (editorLoaded) {
  //     setTimeout(() => {
  //       setShow(true);
  //     }, 3000);
  //   }
  // }, [editorLoaded]);

  // const closePopover = () => {
  //   localStorage.setItem('show:survey', 'false');
  //   setShow(false);
  // };

  // return (
  //   <div className='absolute bottom-10 left-10 z-10'>
  //     <Transition.Root show={show} as={Fragment}>
  //       <div>
  //         <Transition.Child
  //           as={Fragment}
  //           enter="ease-out duration-300"
  //           enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  //           enterTo="opacity-100 translate-y-0 sm:scale-100"
  //           leave="ease-in duration-200"
  //           leaveFrom="opacity-100 translate-y-0 sm:scale-100"
  //           leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  //         >
  //           <div className="relative bg-white px-7 py-10 rounded-lg shadow-md">
  //             <div className='flex flex-row flex-wrap gap-x-4'>
  //               <div>
  //                 <img
  //                   className="inline-block"
  //                   src={`${process.env.PUBLIC_URL}/img/survey-illustration.svg`}
  //                   alt="AsyncAPI Logo"
  //                 />
  //               </div>
  //               <div>
  //                 <h3 className='bold text-lg font-bold mb-3'>Help us improve AsyncAPI Studio</h3>
  //                 <p className='text-base max-w-xs mb-6'>We know that the best way to improve our tools is to understand our users better. Help us define your needs by completing this short survey!</p>
  //                 <div className='flex flex-row flex-wrap gap-x-1'>
  //                   <a 
  //                     className='font-medium px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors'
  //                     href='https://forms.gle/js9Bibu1hug6Yzzb7' title='EDA User Survey' target='_blank' rel="noreferrer"
  //                     onClick={closePopover}
  //                   >
  //                       Go to Survey
  //                   </a>
  //                   <button 
  //                     className='text-gray-400 ml-4 hover:text-gray-700 transition-colors'
  //                     onClick={closePopover}
  //                   >
  //                       No thanks
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //             <button 
  //               className='absolute right-5 top-5'
  //               onClick={closePopover}
  //             >
  //               <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  //                 <path d="M1 1L13 13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
  //                 <path d="M13 1L1 13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
  //               </svg>
  //             </button>
  //           </div>
  //         </Transition.Child>
  //       </div>
  //     </Transition.Root>
  //   </div>
  // );
};
