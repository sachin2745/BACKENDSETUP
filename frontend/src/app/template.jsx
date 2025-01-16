'use client';

import { HydrationOverlay } from '@builder.io/react-hydration-overlay';
import React from 'react';


const Template = ({ children }) => {
    return (
        <div>
            <HydrationOverlay>
            {children}
            </HydrationOverlay>
        </div>
    )
}

export default Template