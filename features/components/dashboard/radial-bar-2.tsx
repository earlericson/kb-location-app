"use client";

import { useBreakPoint } from '@/hooks/use-break-point';
import { RadialBarProps } from '@/types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export const RadialStatBox2 = ({ label, color, textColor, icon, value, total }: RadialBarProps) => {
    // Calculate percentage for the bar or visual effect if needed
    const data = [{ name: label, value: value, fill: color }];

    // const isMobile = useBreakPoint();

    // // Define responsive configuration
    // const chartConfig = isMobile
    //     ? { innerRadius: "50%", barSize: 6 }
    //     : { innerRadius: "70%", barSize: 10 };

    return (
        <div className="flex flex-col w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm  items-center justify-center">
            <div className="h-20 w-20">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="75%"
                        outerRadius="100%"
                        barSize={7}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <circle cx="50%" cy="50%" r="30%" fill={color} fillOpacity={0.15} />
                        <PolarAngleAxis type="number" domain={[0, total || 1]} tick={false} />
                        <RadialBar
                            background={{ fill: '#f3f4f6' }}
                            dataKey="value"
                            cornerRadius={10}
                            fill={color}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col items-center gap-2 mt-2">
                <div className="text-gray-400">{icon}</div>
                <p className="text-xs text-gray-500 font-medium uppercase">{label}</p>
                <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
            </div>
        </div>
    );
};