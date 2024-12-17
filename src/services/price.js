export async function getPriceInfo(contractAddress) {
    try {
        const response = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Find the pair with highest liquidity
        const pairs = data.pairs?.sort((a, b) => 
            (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
        ) || [];

        const pair = pairs[0];
        if (!pair) {
            return {
                priceUsd: '0.00',
                priceChange24h: '0',
                marketCap: '0',
                volume24h: '0',
                liquidity: '0'
            };
        }

        return {
            priceUsd: pair.priceUsd || '0.00',
            priceChange24h: pair.priceChange24h || '0',
            marketCap: pair.marketCap || pair.fdv || '0',
            volume24h: pair.volume24h || '0',
            liquidity: pair.liquidity?.usd || '0'
        };
    } catch (error) {
        console.error('Error fetching price info:', error);
        return {
            priceUsd: '0.00',
            priceChange24h: '0',
            marketCap: '0',
            volume24h: '0',
            liquidity: '0'
        };
    }
} 