import { ActionMenu } from '@/features/components/dashboard/action-menu';
import { DashboardChart } from '@/features/components/dashboard/chart';
import { RadialStatBox } from '@/features/components/dashboard/radial-bar';
import { ArrowRight, CheckCircle2, FileEdit, ImageIcon, MoreHorizontal, User, UserCircle } from 'lucide-react';


const chartData = [
    { name: 'Jan', published: 400, draft: 240 },
    { name: 'Feb', published: 300, draft: 139 },
    { name: 'Mar', published: 600, draft: 380 },
    { name: 'Apr', published: 800, draft: 490 },
    { name: 'May', published: 500, draft: 300 },
    { name: 'Jun', published: 900, draft: 450 },
];


// --- MOCK DATA (Replace with Firebase fetches later) ---
const mockStats = { published: 124, drafted: 18, totalViews: 4520 };

const latestLocations = [
    { id: '1', name: 'Knockerball Connecticut', latitude: "41.640378", longitude: "73.2057595", status: 'Published' },
    { id: '2', name: 'Knockerball Rome', latitude: "41.2901378", longitude: "-96.1585810", status: 'Draft' },
    { id: '3', name: 'Pure Contact Knockerball (NC)', latitude: "35.22455", longitude: "-78.8668649", status: 'Published' },
    { id: '4', name: 'Knockerball Run', latitude: "41.640378", longitude: "73.2057595", status: 'Draft' },
    { id: '5', name: 'Knockerball of Suffolk', latitude: "41.640378", longitude: "73.2057595", status: 'Published' },
];

const logs = [
    { id: '101', action: 'Location synced', user: 'Admin', time: '10 mins ago' },
    { id: '102', action: 'Image uploaded', user: 'Admin', time: '1 hour ago' },
    { id: '103', action: 'Draft created', user: 'Editor', time: '3 hours ago' },
    { id: '104', action: 'Coordinates updated', user: 'Admin', time: '5 hours ago' },
    { id: '105', action: 'Coordinates updated', user: 'Admin', time: '5 hours ago' },
];

export default function DashboardMain() {

    const published = 124;
    const drafts = 18;
    const total = published + drafts;

    return (
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6 bg-gray-50 min-h-screen text-slate-800">


            {/* 2. MIDDLE SECTION: CHART & LOGS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart */}
                <div className="lg:col-span-2 bg-gray-100 p-4 rounded-xl min-h-300px flex flex-col">
                    {/* Header */}
                    <div className="mb-5">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500">Welcome back! Here is what's happening with your map data today.</p>
                    </div>
                    {/* Placeholder for Chart (e.g., Recharts or Chart.js) */}
                    <DashboardChart
                        initialData={chartData}
                        title="Content Performance"
                    />
                </div>

                {/* Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-1 bg-gray-100 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[1.2rem]">Status</h3>
                        <a href="#" className="flex gap-2 items-center text-gray-400 hover:text-gray-700">View All<ArrowRight size={15} /></a>
                    </div>


                    <div className="grid grid-cols-1 h-[420px] mt-5 gap-4">
                        <div className="flex flex-col ">
                            <RadialStatBox
                                label="Published"
                                value={published}
                                total={total}
                                color="#10b981"
                                textColor="text-emerald-600"
                                icon={< CheckCircle2 size={30} />}
                            />
                        </div>
                        <div className="flex flex-col">
                            <RadialStatBox
                                label="Drafts"
                                value={drafts}
                                total={total}
                                color="#f59e0b"
                                textColor="text-amber-600"
                                icon={<FileEdit size={30} />}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 3. LATEST 5 LOCATIONS TABLE */}
                <div className='bg-gray-100 p-4 lg:col-span-2 rounded-xl'>
                    <div className=" bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex p-6 border-b border-gray-100 justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Latest Locations</h2>
                            <ActionMenu
                                options={[
                                    { label: 'View All', path: '/dashboard/locations' }
                                ]}
                            />
                        </div>
                        <div className="overflow-x-auto ">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm">
                                        <th className="px-6 py-4 font-semibold">Business Name</th>
                                        <th className="px-6 py-4 font-semibold">Coordinates</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    {latestLocations.map((loc) => (
                                        <tr key={loc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{loc.name}</td>
                                            <td className="flex flex-1 px-6 py-4 text-gray-500 gap-4">
                                                <label><span className='text-[10px] font-mono'>Lat:</span> {loc.latitude}</label>
                                                <label><span className='text-[10px] font-mono'>Lng:</span> {loc.longitude}</label>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${loc.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {loc.status}
                                                </span>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='bg-gray-100 p-4 rounded-xl'>
                    {/* Logs Area (Takes up 1 column) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
                        <div className='flex border-b border-gray-100 pb-2 justify-between'>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Logs</h2>
                            <ActionMenu
                                options={[
                                    { label: 'View All', path: '/dashboard/recent-logs' }
                                ]}
                            />
                        </div>
                        <div className="mt-4">
                            {logs.map((log) => (
                                <div key={log.id} className="flex border-gray-50  pb-5 last:pb-0 relative justify-between group">
                                    <div className='flex gap-2'>
                                        <UserCircle className="text-gray-400" />
                                        <div className='flex flex-col'>
                                            <span className="text-sm font-medium text-gray-700">{log.action}</span>
                                            <span className="text-xs text-gray-400">{log.user}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        <span>{log.time}</span>
                                    </div>
                                    <div className='absolute bottom-0.5 left-2.5 w-0 h-7 border-l border-gray-300 group-last:hidden' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>




        </div>
    );
}