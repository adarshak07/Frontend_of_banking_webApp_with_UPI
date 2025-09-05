import api from "../api"; // reusing axios instance

// Add Account API
export const addAccount = async (accountData) => {
  try {
    const response = await api.post("/accounts", accountData);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};

// Get all accounts
export const getAccounts = async () => {
  try {
    const response = await api.get("/accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};