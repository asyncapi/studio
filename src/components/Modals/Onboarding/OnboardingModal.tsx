import React, { useRef } from "react";
import { VscBook } from "react-icons/vsc";
import { ConfirmModal } from "../ConfirmModal";
import OnboardingContent from './OnboardingContent.json';

export const OnboardingModal: React.FunctionComponent = () => {
    // const [onboardingContentRef] = useRef(OnboardingContent);
    return (
        <ConfirmModal
            title={'Onboarding Docs'}
            confirmText="Get Started"
            opener={
                <button
                    className={'flex border-l-2 text-gray-500 hover:text-white border-gray-800 focus:outline-none border-box p-4'}
                    type="button"  
                    title="Onboarding"  
                >
                    <VscBook className="w-5 h-5" />
                </button>
            }
        >

        </ConfirmModal>
    )
}