const INITIAL_SUPPLY = 1_000_000_000;

export async function getTokenInfo(tokenAddress) {
    try {
        const response = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const pair = data.pairs?.[0];
        
        if (!pair) {
            return {
                initialSupply: INITIAL_SUPPLY,
                currentSupply: 0,
                burnedSupply: 0,
                burnedValueUsd: '0',
                priceUsd: '0.00',
                marketCap: '0',
                volume24h: '0',
                liquidity: '0'
            };
        }

        // Calculate supplies from market data
        const currentSupply = pair.fdv / Number(pair.priceUsd);
        const burnedSupply = INITIAL_SUPPLY - currentSupply;
        const burnedValueUsd = burnedSupply * Number(pair.priceUsd);

        return {
            initialSupply: INITIAL_SUPPLY,
            currentSupply: Math.round(currentSupply),
            burnedSupply: Math.round(burnedSupply),
            burnedValueUsd: Math.round(burnedValueUsd),
            priceUsd: pair.priceUsd || '0.00',
            marketCap: pair.fdv || '0',
            volume24h: pair.volume24h || '0',
            liquidity: pair.liquidity?.usd || '0'
        };
    } catch (error) {
        console.error('Error fetching token info:', error);
        return {
            initialSupply: INITIAL_SUPPLY,
            currentSupply: 0,
            burnedSupply: 0,
            burnedValueUsd: '0',
            priceUsd: '0.00',
            marketCap: '0',
            volume24h: '0',
            liquidity: '0'
        };
    }
} 