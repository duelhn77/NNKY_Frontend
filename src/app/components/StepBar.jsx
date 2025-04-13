import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

export const StepBar = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center flex-wrap gap-y-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center min-w-[64px] text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${
                    index < currentStep
                      ? 'bg-gray-800 border-gray-800 text-white'
                      : index === currentStep
                      ? 'border-gray-800 text-gray-800'
                      : 'border-gray-300 text-gray-300'
                  }`}
              >
                {index < currentStep ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  index <= currentStep ? 'text-gray-800' : 'text-gray-300'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] w-6 sm:w-12 mx-1 sm:mx-2 ${
                  index < currentStep ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

StepBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
};
