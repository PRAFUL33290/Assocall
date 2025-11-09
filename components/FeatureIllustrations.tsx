import React from 'react';

export const HeroIllustration = () => (
    <svg width="100%" height="100%" viewBox="0 0 550 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="550" height="400" rx="20" fill="#F9FAFB"/>
        
        {/* Main Dashboard Panel */}
        <rect x="50" y="40" width="450" height="320" rx="15" fill="white" stroke="#E5E7EB" strokeWidth="2"/>

        {/* Header */}
        <rect x="50" y="40" width="450" height="50" rx="0" fill="#F3F4F6" style={{borderTopLeftRadius: '15px', borderTopRightRadius: '15px'}}/>
        <circle cx="75" cy="65" r="8" fill="#FF5F56"/>
        <circle cx="100" cy="65" r="8" fill="#FFBD2E"/>
        <circle cx="125" cy="65" r="8" fill="#27C93F"/>

        {/* Sidebar */}
        <rect x="50" y="90" width="120" height="270" fill="#F9FAFB" style={{borderBottomLeftRadius: '15px'}}/>
        <rect x="70" y="110" width="80" height="10" rx="5" fill="#E5E7EB"/>
        <rect x="70" y="140" width="80" height="10" rx="5" fill="#E9F0FF"/>
        <rect x="70" y="170" width="80" height="10" rx="5" fill="#E5E7EB"/>
        <rect x="70" y="200" width="80" height="10" rx="5" fill="#E5E7EB"/>

        {/* Main content area */}
        {/* Profile card */}
        <rect x="190" y="110" width="290" height="70" rx="10" fill="white" stroke="#E5E7EB"/>
        <circle cx="225" cy="145" r="20" fill="#E9F0FF" stroke="#0066FF" strokeWidth="3"/>
        <rect x="260" y="130" width="150" height="8" rx="4" fill="#E5E7EB"/>
        <rect x="260" y="145" width="100" height="8" rx="4" fill="#E5E7EB"/>

        {/* Chart Card */}
        <rect x="190" y="200" width="135" height="140" rx="10" fill="white" stroke="#E5E7EB"/>
        <rect x="205" y="220" width="105" height="8" rx="4" fill="#E5E7EB"/>
        {/* Bars */}
        <rect x="215" y="250" width="15" height="60" rx="5" fill="#E9F0FF"/>
        <rect x="245" y="270" width="15" height="40" rx="5" fill="#0066FF"/>
        <rect x="275" y="240" width="15" height="70" rx="5" fill="#E6FAF5"/>

        {/* Project List Card */}
        <rect x="345" y="200" width="135" height="140" rx="10" fill="white" stroke="#E5E7EB"/>
        <rect x="360" y="220" width="105" height="8" rx="4" fill="#E5E7EB"/>
        {/* List items */}
        <rect x="360" y="245" width="100" height="20" rx="5" fill="#F3F4F6"/>
        <rect x="360" y="275" width="100" height="20" rx="5" fill="#F3F4F6"/>
        <rect x="360" y="305" width="100" height="20" rx="5" fill="#F3F4F6"/>

        {/* Floating AI icon */}
        <g transform="translate(430, 60)">
            <circle cx="20" cy="20" r="25" fill="#00C896"/>
            <path d="M15 15 L 25 15 L 20 25 Z" fill="white" transform="rotate(45, 20, 20)"/>
            <path d="M20 12 L 28 20 L 20 28 L 12 20 Z" fill="white" opacity="0.8"/>
        </g>
    </svg>
);

export const FeatureIllustration1 = () => (
    <svg width="100%" height="100%" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="50" width="400" height="250" rx="10" fill="white" stroke="#E5E7EB"/>
        <circle cx="150" cy="120" r="40" fill="#E9F0FF"/>
        <path d="M175 145L195 165" stroke="#0066FF" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="150" cy="120" r="30" fill="white" stroke="#0066FF" strokeWidth="8"/>
        <rect x="230" y="90" width="180" height="15" rx="7.5" fill="#E5E7EB"/>
        <rect x="230" y="120" width="140" height="15" rx="7.5" fill="#E5E7EB"/>
        <rect x="230" y="150" width="160" height="15" rx="7.5" fill="#E5E7EB"/>
        <rect x="80" y="200" width="120" height="70" rx="10" fill="#E6FAF5"/>
        <rect x="95" y="215" width="20" height="40" rx="5" fill="#00C896"/>
        <rect x="125" y="230" width="20" height="25" rx="5" fill="#00C896" opacity="0.6"/>
        <rect x="155" y="222" width="20" height="33" rx="5" fill="#00C896" opacity="0.8"/>
        <rect x="220" y="200" width="200" height="70" rx="10" fill="#E9F0FF"/>
        <path d="M240 250C260 220, 280 260, 300 240C320 220, 340 255, 360 230L380 245" stroke="#0066FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const FeatureIllustration2 = () => (
    <svg width="100%" height="100%" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50 H 350 Q 400 50, 400 100 V 300 Q 400 350, 350 350 H 100 Q 50 350, 50 300 V 100 Q 50 50, 100 50 Z" fill="white" stroke="#E5E7EB"/>
        <rect x="80" y="80" width="290" height="10" rx="5" fill="#E5E7EB"/>
        <rect x="80" y="105" width="290" height="10" rx="5" fill="#E5E7EB"/>
        <rect x="80" y="130" width="240" height="10" rx="5" fill="#E5E7EB"/>
        <rect x="80" y="155" width="290" height="10" rx="5" fill="#E5E7EB"/>
        <rect x="80" y="180" width="180" height="10" rx="5" fill="#E5E7EB"/>
        <g transform="translate(300, 180)">
            <path d="M20,0 L40,0 L30,50 Z" fill="#00C896"/>
            <circle cx="30" cy="60" r="10" fill="#00C896"/>
            <path d="M0,70 L60,70 L30,120 Z" fill="#00C896" transform="rotate(30, 30, 95)"/>
            <g>
                <path d="M 50 20 L 55 15 L 60 20 L 55 25 Z" fill="#FFD700"/>
                <path d="M 80 40 L 85 35 L 90 40 L 85 45 Z" fill="#FFD700" opacity="0.8"/>
                <path d="M 60 70 L 65 65 L 70 70 L 65 75 Z" fill="#FFD700" opacity="0.9"/>
            </g>
        </g>
    </svg>
);

export const FeatureIllustration3 = () => (
    <svg width="100%" height="100%" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="50" width="400" height="250" rx="10" fill="white" stroke="#E5E7EB"/>
        <rect x="70" y="70" width="110" height="210" rx="8" fill="#F3F4F6"/>
        <rect x="70" y="70" width="110" height="30" rx="0" fill="#E5E7EB" style={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}/>
        <text x="125" y="90" textAnchor="middle" fill="#4B5563" fontWeight="bold" fontSize="12">À FAIRE</text>
        <rect x="195" y="70" width="110" height="210" rx="8" fill="#F3F4F6"/>
        <rect x="195" y="70" width="110" height="30" rx="0" fill="#E9F0FF" style={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}/>
        <text x="250" y="90" textAnchor="middle" fill="#0066FF" fontWeight="bold" fontSize="12">EN COURS</text>
        <rect x="320" y="70" width="110" height="210" rx="8" fill="#F3F4F6"/>
        <rect x="320" y="70" width="110" height="30" rx="0" fill="#E6FAF5" style={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}/>
        <text x="375" y="90" textAnchor="middle" fill="#00C896" fontWeight="bold" fontSize="12">TERMINÉ</text>
        {/* Cards */}
        <rect x="80" y="110" width="90" height="50" rx="5" fill="white" stroke="#E5E7EB"/>
        <rect x="85" y="120" width="60" height="5" rx="2.5" fill="#E5E7EB"/>
        <rect x="85" y="130" width="75" height="5" rx="2.5" fill="#E5E7EB"/>
        <rect x="205" y="110" width="90" height="70" rx="5" fill="white" stroke="#0066FF" strokeWidth="2"/>
        <rect x="210" y="120" width="60" height="5" rx="2.5" fill="#0066FF" opacity="0.3"/>
        <rect x="210" y="130" width="75" height="5" rx="2.5" fill="#0066FF" opacity="0.3"/>
        <rect x="210" y="140" width="50" height="5" rx="2.5" fill="#0066FF" opacity="0.3"/>
        <rect x="330" y="110" width="90" height="60" rx="5" fill="white" stroke="#E5E7EB"/>
        <rect x="335" y="120" width="60" height="5" rx="2.5" fill="#E5E7EB"/>
        <rect x="335" y="130" width="75" height="5" rx="2.5" fill="#E5E7EB"/>
        <rect x="80" y="170" width="90" height="60" rx="5" fill="white" stroke="#E5E7EB"/>
        <rect x="85" y="180" width="60" height="5" rx="2.5" fill="#E5E7EB"/>
        <rect x="85" y="190" width="75" height="5" rx="2.5" fill="#E5E7EB"/>
    </svg>
);

export const FeatureIllustration4 = () => (
    <svg width="100%" height="100%" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Building */}
        <path d="M300 120 V 300 H 450 V 120 L 375 80 L 300 120 Z" fill="#E9F0FF" stroke="#0066FF" strokeWidth="4"/>
        <rect x="320" y="220" width="30" height="80" fill="#0066FF" stroke="#0066FF" strokeWidth="4"/>
        <rect x="330" y="140" width="20" height="30" fill="white"/>
        <rect x="380" y="140" width="20" height="30" fill="white"/>
        <rect x="330" y="180" width="20" height="30" fill="white"/>
        <rect x="380" y="180" width="20" height="30" fill="white"/>
        {/* User icon */}
        <circle cx="100" cy="150" r="20" fill="#E6FAF5" stroke="#00C896" strokeWidth="4"/>
        <path d="M100 170 C 80 190, 120 190, 100 170" fill="none" stroke="#00C896" strokeWidth="4"/>
        <path d="M 70 210 C 80 190, 120 190, 130 210" fill="#E6FAF5" stroke="#00C896" strokeWidth="4"/>
        {/* Document Icon */}
        <rect x="150" y="200" width="80" height="100" rx="5" fill="white" stroke="#E5E7EB" strokeWidth="4"/>
        <line x1="160" y1="220" x2="220" y2="220" stroke="#E5E7EB" strokeWidth="4"/>
        <line x1="160" y1="235" x2="200" y2="235" stroke="#E5E7EB" strokeWidth="4"/>
        <line x1="160" y1="250" x2="220" y2="250" stroke="#E5E7EB" strokeWidth="4"/>
        {/* Connection lines */}
        <path d="M130 190 C 200 150, 250 150, 300 160" stroke="#00C896" strokeWidth="4" strokeDasharray="10 5" strokeLinecap="round"/>
        <path d="M230 240 C 260 250, 280 220, 300 210" stroke="#0066FF" strokeWidth="4" strokeDasharray="10 5" strokeLinecap="round"/>
    </svg>
);
