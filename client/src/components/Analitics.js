import React, {lazy, Suspense } from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
const LabelsPie = lazy(() => import('./tiles/LabelsPie'));
const TimeLine = lazy(() => import('./tiles/TimeLine'));

export default function Analitics() {
    return (
        <div style={{display:'flex', flexDirection: 'column', alignItems:'center'}}>
            <Suspense fallback={<CircularProgress/>}>
            <LabelsPie/>
            </Suspense>
            <Suspense fallback={<CircularProgress/>}>
            <TimeLine/>
            </Suspense>

        </div>
    )
}
