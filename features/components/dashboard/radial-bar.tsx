"use client";

import { useRadialChartData } from '@/hooks/use-radial-bar';
import { RadialBarProps } from '@/types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export const RadialStatBox = ({ status, label, color, textColor, icon }: RadialBarProps) => {

    // The component now handles its own data fetching
    const { published, draft, total } = useRadialChartData('locations');

    // Select the value based on the prop passed to the component
    const value = status === 'published' ? published : draft;
    const data = [{ name: status, value: value, fill: color }];
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3">
            <div>

                <div className="mb-3 text-gray-400">
                    {icon}
                </div>
                <p className="text-md text-gray-500 font-medium">{label}</p>
                <p className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</p>
            </div>

            <div className="h-37 w-37">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={15}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <circle cx="50%" cy="50%" r="32%" fill={color} fillOpacity={0.3} />

                        <PolarAngleAxis type="number" domain={[0, total || 1]} angleAxisId={0} tick={false} />
                        <RadialBar
                            background={{ fill: '#f3f4f6' }}
                            dataKey="value"
                            cornerRadius={10}
                            fill={color}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};