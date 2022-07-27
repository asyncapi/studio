import React, { useRef, useState } from "react";
import { VscBook } from "react-icons/vsc";
import { ConfirmModal } from "../ConfirmModal";
import { FeatureContent } from "./FeatureContent";
import OnboardingContent from './OnboardingContent.json';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper';

import { useSwiperRef, checkLastSnapIndex } from '../../common/swiper';

export const OnboardingModal: React.FunctionComponent = () => {
    const onboardingContentRef = useRef(OnboardingContent);

    const [nextEl, nextElRef] = useSwiperRef();
    const [prevEl, prevElRef] = useSwiperRef();
    const [current, setCurrent] = useState(0);
    return (
        <ConfirmModal
            title={'Onboarding Docs'}
            confirmText="Get Started"
            confirmDisabled={false}
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
            <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={8}
                slidesPerView={1}
                onSlideChange={(swiper) => setCurrent(swiper.snapIndex)}
                // navigation={{ prevElRef, nextElRef }}        this line is not working
                breakpoints={{
                    640: {
                        slidesPerView: 2
                    }
                }}
            >
                {onboardingContentRef.current?.map((feature, featureIndex) => (
                    <SwiperSlide key={featureIndex}>
                        <FeatureContent 
                            featureTitle={feature?.featureTitle}
                            featureDescription={feature?.featureDescription}
                            newFeatureTag={feature?.newFeatureTag}
                            featureScreenshot={feature?.featureScreenshot}
                            featureCount={featureIndex+1}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </ConfirmModal>
    )
}