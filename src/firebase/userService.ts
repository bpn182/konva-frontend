import axiosInstance from './axiosConfig';

/**
 * Retrieves a user by their username from Firestore using axios.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<{ id: string, username: string } | null>} - The user data if found, otherwise null.
 */
const getUserByUsername = async (username: string) => {
  try {
    const response = await axiosInstance.get(`/getUser/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
};

/**
 * Creates a new user with the given username in Firestore using axios.
 * @param {string} username - The username of the new user.
 * @returns {Promise<{ id: string, username: string }>} - The created user data.
 */
const createUser = async (username: string) => {
  try {
    const response = await axiosInstance.post('/createUser', { username });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export { getUserByUsername, createUser };