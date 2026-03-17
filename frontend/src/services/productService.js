const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const productService = {

  // Get all products
  getAll: async (category = "", search = "") => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search)   params.append("search", search);
    const res = await fetch(`${BASE_URL}/products?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  // Add new product
  add: async (product) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add product");
    return data;
  },

  // Update product
  update: async (id, product) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update product");
    return data;
  },

  // Delete product
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete product");
    return data;
  },
};

export default productService;
