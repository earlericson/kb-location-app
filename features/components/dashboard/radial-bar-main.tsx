import { useRadialChartData } from '@/hooks/use-radial-bar';
import { ArrowRight, CheckCircle2, FileEdit, Home, Tag } from 'lucide-react';
import { RadialStatBox } from './radial-bar';
import { statusStyles } from '@/features/map/components/map-marker-color';
import { RadialStatBox2 } from './radial-bar-2';
import { ActionMenu } from './action-menu';

export const RadialSummaryGrid = ({ days }: { days: number }) => {
    // 1. Fetch data once for the whole grid
    const counts = useRadialChartData('locations', days);

    // 2. Render the grid
    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-[1.2rem]">Status</h3>
                {/* <a href="#" className="flex gap-2 items-center text-gray-400 hover:text-gray-700">View All<ArrowRight size={15} /></a> */}
                <ActionMenu
                    options={[
                        { label: 'Active', path: '/active' },
                        { label: 'For Sale', path: '/forsale' },
                        { label: 'Available', path: '/available' }
                    ]}
                />
            </div>
            {/* end */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    {/* <RadialStatBox
                                label="Published"
                                status="published"
                                color="#10b981"
                                textColor="text-emerald-600"
                                icon={< CheckCircle2 size={30} />}
                            /> */}

                    <RadialStatBox
                        label="Active"
                        status="Active"
                        color={statusStyles.active.fill}
                        textColor={statusStyles.active.text}
                        value={counts['active'] || 0}
                        total={counts.total}
                        icon={<CheckCircle2 size={20} />}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <RadialStatBox2
                        label="For Sale"
                        status="For Sale"
                        color={statusStyles.forsale.fill}
                        textColor={statusStyles.forsale.text}
                        value={counts['forsale'] || 0}
                        total={counts.total}
                        icon={<Tag size={15} />}
                    />
                    <RadialStatBox2
                        label="Available"
                        status="Available"
                        color={statusStyles.available.fill}
                        textColor={statusStyles.available.text}
                        value={counts['available'] || 0}
                        total={counts.total}
                        icon={<Home size={15} />}
                    />
                </div>
            </div>
        </>
    );
};