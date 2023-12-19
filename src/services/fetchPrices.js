const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Coin = require("../models/coinModel");

const cryptoCurrencies = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'SOL', 'USDC', 'ADA', 'AVAX', 'DOGE'];

async function getPrice(currency) { 
  try {
    const response = await axios.get(`https://api.coinbase.com/v2/prices/${currency}-USD/spot`);
    const price = await response.data.data.amount;

    updatePrice(currency, price)
  } catch (error) {
    console.error(`Error fetching price for ${currency}: ${error.message}`);
  }
}

async function fetchPrices() {

  const coins = await Coin.find();

  const cryptos = coins.map((coin)=>{
    return coin.symbol
  })

  if(cryptos){
  for (const currency of cryptos) {
    await getPrice(currency);
    // Wait for 210 ms to not trigger the rate limit
    await new Promise(resolve => setTimeout(resolve, 210));
  }
  }else{
    for (const currency of cryptoCurrencies) {
      await getPrice(currency);
      // Wait for 210 ms to not trigger the rate limit
      await new Promise(resolve => setTimeout(resolve, 210));
    }
  }
}

async function updatePrice(currency, price){
  try {
    const updatedCoin = await Coin.findOneAndUpdate(
      { symbol: currency },
      { price: price },
      { new: true } // Set to true to return the updated document
    ).exec();
  } catch (error) {
    console.error('Error updating coin:', error);
  }
}

// Wrap the connectToDatabase function with express-async-handler
const asyncFetchPrices = asyncHandler(fetchPrices);

// Export the asyncConnectToDatabase
module.exports = asyncFetchPrices;
