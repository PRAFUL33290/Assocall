import React from 'react';
import { ArrowUpRightIcon } from './icons';

interface LogoProps {
  containerClassName?: string;
  textColorClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ containerClassName, textColorClassName = 'text-asso-blue' }) => {
    return (
        <span className={`inline-flex items-center gap-1 font-poppins font-bold ${textColorClassName} ${containerClassName || ''}`}>
            <span>AssoCall</span>
            <ArrowUpRightIcon className="h-[0.8em] w-[0.8em]" />
        </span>
    );
};

export default Logo;
