const io = require('socket.io-client');
const Coin = require("../models/coinModel");

const asyncHandler = require('express-async-handler');
const CoinbasePro = require('coinbase-pro');
const publicClient = new CoinbasePro.PublicClient();

async function subscribeToCoinbaseTicker() {

    const cryptoCurrencies = ['BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'XRP-USD', 'SOL-USD', 'USDC-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD'];

    const websocket = await new CoinbasePro.WebsocketClient(
        cryptoCurrencies,
        'wss://ws-feed.exchange.coinbase.com',
        null,
      );

      let i = 1;

      setTimeout(function() {
        websocket.unsubscribe({ channels: ['heartbeat'] });
        websocket.subscribe({
            "type": "subscribe",
            "product_ids": cryptoCurrencies,
            "channels": ["ticker"]
        })
      }, 3000);

      websocket.on('message', data => {
        if(data.type = "ticker" && data.product_id){
            //console.log(data.product_id)
            try {
                const updatedCoin = Coin.findOneAndUpdate(
                  { symbol: data.product_id.replace(/-USD$/, '') },
                  { price: data.price },
                  { new: true } // Set to true to return the updated document
                ).exec();
            
              } catch (error) {
                console.error('Error updating coin:', error);
              }
        }
      });

      websocket.on('error', err => {
        /* handle error */
      });
      websocket.on('close', () => {
        /* ... */
      });

}

// Wrap the connectToDatabase function with express-async-handler
const asyncSubscribeToCoinbaseTicker = asyncHandler(subscribeToCoinbaseTicker);

// Export the asyncConnectToDatabase
module.exports = asyncSubscribeToCoinbaseTicker;