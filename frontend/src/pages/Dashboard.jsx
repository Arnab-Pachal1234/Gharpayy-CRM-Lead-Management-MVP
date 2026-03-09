import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchDashboardStats();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Leads</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalLeads}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Visits Scheduled</h2>
          <p className="text-4xl font-bold mt-2">{stats.visitsScheduled}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Bookings Confirmed</h2>
          <p className="text-4xl font-bold mt-2">{stats.bookingsConfirmed}</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Pipeline Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.pipeline).map(([stage, count]) => (
            <div key={stage} className="bg-gray-50 p-4 border rounded text-center">
              <p className="text-2xl font-semibold text-gray-800">{count}</p>
              <p className="text-sm text-gray-600 mt-1">{stage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;