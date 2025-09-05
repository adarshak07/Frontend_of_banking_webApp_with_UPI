import { upiService } from "./upiService";

// Calculate coins based on transactions
export const calculateCoins = async () => {
  try {
    // Get UPI transactions
    const vpas = await upiService.getUserVpas().catch(() => []);
    let totalTransactions = 0;
    
    for (const vpa of vpas) {
      try {
        const transactions = await upiService.getTransactions(vpa.vpa);
        if (Array.isArray(transactions)) {
          totalTransactions += transactions.length;
        }
      } catch (error) {
        console.log(`No transactions for VPA ${vpa.vpa}:`, error);
      }
    }
    
    // Calculate coins: 10 coins per transaction + 50 bonus for having UPI IDs
    const baseCoins = totalTransactions * 10;
    const bonusCoins = vpas.length * 50;
    const totalCoins = baseCoins + bonusCoins;
    
    console.log(`Calculated coins: ${totalCoins} (${totalTransactions} transactions * 10 + ${vpas.length} VPAs * 50 bonus)`);
    
    return {
      coins: totalCoins,
      transactionCount: totalTransactions,
      vpaCount: vpas.length
    };
  } catch (error) {
    console.error("Error calculating coins:", error);
    return {
      coins: 0,
      transactionCount: 0,
      vpaCount: 0
    };
  }
};

// Get wallet data with calculated coins
export const getWalletData = async () => {
  const coinData = await calculateCoins();
  return {
    coins: coinData.coins,
    transactionCount: coinData.transactionCount,
    vpaCount: coinData.vpaCount
  };
};
