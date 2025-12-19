import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import './UsersManagement.css';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="users-management-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="users-management-page">
                <div className="page-header">
                    <h1>Users Management</h1>
                </div>
                <div className="error-message">
                    {error}
                    <button onClick={fetchUsers} className="retry-btn">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="users-management-page">
            <div className="page-header">
                <div>
                    <h1>Users Management</h1>
                    <p>View registered users from Clerk</p>
                </div>
                <button onClick={fetchUsers} className="refresh-btn">
                    Refresh
                </button>
            </div>

            <div className="users-table-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>Joined</th>
                                <th>Last Sign In</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td><code>{user.id.substring(0, 12)}...</code></td>
                                        <td><strong>{user.email}</strong></td>
                                        <td>{user.full_name || 'N/A'}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                        No users found. Users will appear here when they sign up with Clerk.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
