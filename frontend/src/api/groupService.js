import apiClient from './apiClient';

export const getGroups = () => apiClient.get('/groups');
export const getGroupsByUserId = (userId) => apiClient.get(`/groups/user/${userId}`);
export const getGroupById = (id) => apiClient.get(`/groups/${id}`);
export const createGroup = (groupData) => apiClient.post('/groups', groupData);
export const settleUp = (groupId) => apiClient.post(`/groups/${groupId}/settleUp`);
export const addMember = (groupId, userId) => apiClient.post(`/groups/${groupId}/members`, { userId });
export const addAdmin = (groupId, userId) => apiClient.post(`/groups/${groupId}/admins`, { userId });
