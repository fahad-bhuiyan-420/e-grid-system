"use client";

import React, { useState, useEffect } from "react";
import { deleteUser, getUsers, updateUserRole } from "../../../actions/userActions";


export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            const result = await getUsers();
            if (result.success) {
                setUsers(result.data);
            }
            setLoading(false);
        }
        loadUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        const success = confirm(`Change this user's role to ${newRole}?`);
        if (!success) return;

        const result = await updateUserRole(userId, newRole);

        if (result.success) {
            // Update local state so the UI changes immediately
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } else {
            alert("Error: " + result.error);
        }
    };

    const handleDelete = async (userId, userName) => {
        const confirmed = confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`);
        if (!confirmed) return;

        const result = await deleteUser(userId);

        if (result.success) {
            // Remove the user from the local state immediately
            setUsers(users.filter(user => user.id !== userId));
        } else {
            alert("Error: " + result.error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    console.log(users);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <p className="text-gray-500 text-sm">View and manage all registered accounts on E-Grid.</p>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th className="font-bold text-gray-700">User</th>
                                <th className="font-bold text-gray-700">Role</th>
                                <th className="font-bold text-gray-700">Joined Date</th>
                                <th className="font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-base-200/50 transition-colors">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                    <span className="text-xs">{user.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm opacity-50">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm font-medium ${user.role === 'admin' ? 'badge-secondary' : 'badge-ghost'
                                            }`}>
                                            {user.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Role Change Dropdown */}
                                            <div className="dropdown dropdown-left dropdown-end">
                                                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs text-primary">
                                                    Change Role
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-200">
                                                    <li><button onClick={() => handleRoleChange(user.id, 'user')}>User</button></li>
                                                    <li><button onClick={() => handleRoleChange(user.id, 'organizer')}>Organizer</button></li>
                                                    <li><button onClick={() => handleRoleChange(user.id, 'admin')}>Admin</button></li>
                                                </ul>
                                            </div>

                                            <button onClick={() => handleDelete(user.id, user.name)} className="btn btn-ghost btn-xs text-error">Suspend</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="p-10 text-center text-gray-400">No users found.</div>
                )}
            </div>
        </div>
    );
}