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
        //["ticker"],
      );

      let i = 1;

      setTimeout(function() {
        console.log("One second has passed!");
        websocket.unsubscribe({ channels: ['heartbeat'] });
        websocket.subscribe({
            "type": "subscribe",
            "product_ids": cryptoCurrencies,
            "channels": ["ticker"]
        })
      }, 3000);
     

    //   websocket.on('message', data => {
    //     i++
    //     console.log(data, i)
    //   });

      websocket.on('message', data => {
        if(data.type = "ticker" && data.product_id){
            //console.log(data.product_id)
            try {
                const updatedCoin = Coin.findOneAndUpdate(
                  { symbol: data.product_id.replace(/-USD$/, '') },
                  { price: data.price },
                  { new: true } // Set to true to return the updated document
                ).exec();
            
                //console.log('Updated coin:', updatedCoin);
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

//   const socket = io('wss://ws-feed.exchange.coinbase.com');

//   console.log("first")

//   socket.on('connect', () => {
//     console.log('Socket.IO connection established.');
//   });

//   // Subscription request
//   const subscribeRequest = {
//     type: 'subscribe',
//     product_ids: ['ETH-USD', 'BTC-USD'],
//     channels: ['ticker'],
//   };

//   const ms = await socket.emit('subscribe', subscribeRequest);
//   console.log(ms)
//   const ms = await socket.emit({
//     "type": "subscribe",
//     "channels": [{ "name": "status"});
//   console.log(ms)


//   socket.on('message', (data) => {
//     console.log('Received ticker data:', data);
//     // Handle the received ticker data as needed
//   });

//   socket.on('disconnect', () => {
//     console.log('Socket.IO connection closed.');
//   });

//   socket.on('error', (error) => {
//     console.error('Socket.IO error:', error.message);
//   });
}

// Wrap the connectToDatabase function with express-async-handler
const asyncSubscribeToCoinbaseTicker = asyncHandler(subscribeToCoinbaseTicker);

// Export the asyncConnectToDatabase
module.exports = asyncSubscribeToCoinbaseTicker;