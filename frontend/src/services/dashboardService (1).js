const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const dashboardService = {
  getStats: async (token) => {
    const res = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },

  getRecentOrders: async (token) => {
    const res = await fetch(`${BASE_URL}/orders?limit=5`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },
};

export default dashboardService;
