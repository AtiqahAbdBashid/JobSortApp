import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'Applied',
        location: ''
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications');
            setApplications(response.data.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/applications', formData);
            setFormData({ company: '', position: '', status: 'Applied', location: '' });
            setShowForm(false);
            fetchApplications();
        } catch (error) {
            console.error('Error creating application:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.delete(`/applications/${id}`);
                fetchApplications();
            } catch (error) {
                console.error('Error deleting application:', error);
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading applications...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>My Job Applications</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add Application'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input
                            placeholder="Company *"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                            placeholder="Position *"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            required
                            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                            <option value="Applied">Applied</option>
                            <option value="In Review">In Review</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Accepted">Accepted</option>
                        </select>
                        <input
                            placeholder="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            marginTop: '15px',
                            padding: '10px 30px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Save Application
                    </button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {applications.map(app => (
                    <div key={app._id} style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '15px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>{app.company}</h3>
                                <p style={{ margin: '0 0 5px 0', color: '#666' }}>{app.position}</p>
                            </div>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                backgroundColor: getStatusColor(app.status),
                                color: 'white'
                            }}>
                                {app.status}
                            </span>
                        </div>
                        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#888' }}>
                            Applied: {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                        {app.location && (
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
                                📍 {app.location}
                            </p>
                        )}
                        <button
                            onClick={() => handleDelete(app._id)}
                            style={{
                                marginTop: '10px',
                                padding: '5px 15px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {applications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <p>No applications yet. Start by adding one!</p>
                </div>
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    const colors = {
        'Applied': '#4CAF50',
        'In Review': '#FF9800',
        'Interview': '#2196F3',
        'Offer': '#9C27B0',
        'Rejected': '#f44336',
        'Accepted': '#2E7D32'
    };
    return colors[status] || '#666';
};

export default ApplicationList;