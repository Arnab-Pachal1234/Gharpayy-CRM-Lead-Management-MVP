import { useEffect, useState } from 'react';
import api from '../services/api';
import LeadForm from '../components/LeadForm';

const stages = ['New Lead', 'Contacted', 'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'];

const LeadPipeline = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]); // Store our list of agents
  const [showForm, setShowForm] = useState(false);
  
  // Get the logged-in user's info from local storage
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const isAdmin = userInfo.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch leads (Backend already knows to send all leads for Admin, or just specific leads for Agents)
        const leadsRes = await api.get('/leads');
        setLeads(leadsRes.data.leads || []);

        // 2. If Admin, fetch the list of agents for the reassignment dropdown
        if (isAdmin) {
          const agentsRes = await api.get('/agents');
          console.log("Fetched agents:", agentsRes.data.agents);
          setAgents(agentsRes.data.agents || []);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [isAdmin]);

  // Handle Pipeline Stage Change
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.put(`/leads/${leadId}/status`, { status: newStatus });
      setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  // Handle Admin Reassigning a Lead
  const handleReassign = async (leadId, newAgentId) => {
    try {
      const response = await api.put(`/leads/${leadId}/reassign`, { newAgentId });
      // Update the UI with the new agent info returned from the backend
      setLeads(leads.map(lead => lead._id === leadId ? response.data.lead : lead));
      alert('Lead successfully reassigned!');
    } catch (error) {
      console.error('Error reassigning lead', error);
      alert('Failed to reassign lead.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Pipeline</h1>
          <p className="text-gray-500 text-sm">Logged in as: <span className="font-bold text-blue-600">{userInfo.name} ({userInfo.role})</span></p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          + Add Lead
        </button>
      </div>

      {showForm && (
        <LeadForm 
          onCancel={() => setShowForm(false)} 
          onLeadAdded={(newLead) => {
            setLeads([newLead, ...leads]); // Add new lead to the beginning of the list
            setShowForm(false);
          }} 
        />
      )}

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
        {stages.map(stage => (
          <div key={stage} className="min-w-[300px] bg-gray-200 rounded-lg flex flex-col max-h-full">
            <div className="p-3 font-semibold text-gray-700 bg-gray-300 rounded-t-lg border-b border-gray-400 flex justify-between">
              <span>{stage}</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                {leads.filter(l => l.status === stage).length}
              </span>
            </div>
            
            <div className="p-2 flex-1 overflow-y-auto space-y-3">
              {leads.filter(lead => lead.status === stage).map(lead => (
                <div key={lead._id} className="bg-white p-4 rounded shadow border border-gray-200">
                  <h4 className="font-bold text-gray-800">{lead.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{lead.phone}</p>
                  
                  {/* Pipeline Status Dropdown (Everyone sees this) */}
                  <div className="mb-2">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Stage:</label>
                    <select 
                      className="w-full text-sm border rounded p-1 bg-gray-50 mt-1"
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    >
                      {stages.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Agent Display & Reassignment (Conditional) */}
                  <div className="pt-2 border-t mt-2">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Assigned To:</label>
                    
                    {isAdmin ? (
                      // Admin View: Dropdown to change the agent
                      <select 
                        className="w-full text-sm border rounded p-1 bg-blue-50 text-blue-700 font-semibold mt-1"
                        value={lead.assignedAgent?._id || ''}
                        onChange={(e) => handleReassign(lead._id, e.target.value)}
                      >
                        <option value="" disabled>Select an Agent</option>
                        {agents.map(agent => (
                          <option key={agent._id} value={agent._id}>{agent.name}</option>
                        ))}
                      </select>
                    ) : (
                      // Agent View: Just read-only text
                      <p className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                        {lead.assignedAgent ? lead.assignedAgent.name : 'Unassigned'}
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadPipeline;