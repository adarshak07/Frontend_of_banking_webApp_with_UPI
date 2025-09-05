import api from "../api";

export async function getAiInsights(accountId, months = 6) {
  try {
    const res = await api.get(`/analytics/ai-insights/${accountId}?months=${months}`);
    return res.data;
  } catch (e) {
    const msg = e?.response?.data?.errors || e?.message || "Request failed";
    throw new Error(msg);
  }
}


