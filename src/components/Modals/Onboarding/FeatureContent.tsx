import React from 'react';

interface FeatureContentProps {
  featureTitle: React.ReactNode;
  featureDescription: React.ReactNode;
  newFeatureTag: boolean;
  featureScreenshot: React.ReactNode;
  featureCount: number;
};

export const FeatureContent: React.FunctionComponent<React.PropsWithChildren<FeatureContentProps>> = ({
  featureTitle,
  featureDescription,
  newFeatureTag,
  featureScreenshot,
  featureCount
}) => {
  return (
    <div className='feature-content'>
      {newFeatureTag 
        ? <span className='new-feature-tag text-xs font-semibold text-pink-600'>
            NEW FEATURE
          </span> 
        : <React.Fragment></React.Fragment>}
      <div className='mt-2'>
        <h1 className='feature-title text-lg leading-7 font-bold'>{featureTitle}</h1>
        <p className='feature-description text-sm text-gray-500 leading-6 font-normal'>{featureDescription}</p>
      </div>
      <img src={featureScreenshot?.toString()} 
        className='' 
        alt='feature-cover' 
      />
    </div>
  )
}