import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FoodPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const restaurants = [
    { 
      id: 'rest1', 
      name: 'McDonald\'s', 
      cuisine: 'Fast Food', 
      rating: '4.2', 
      deliveryTime: '25-30 min',
      icon: '🍔',
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      id: 'rest2', 
      name: 'KFC', 
      cuisine: 'Chicken', 
      rating: '4.1', 
      deliveryTime: '30-35 min',
      icon: '🍗',
      color: 'from-red-500 to-red-600'
    },
    { 
      id: 'rest3', 
      name: 'Domino\'s', 
      cuisine: 'Pizza', 
      rating: '4.3', 
      deliveryTime: '20-25 min',
      icon: '🍕',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'rest4', 
      name: 'Subway', 
      cuisine: 'Sandwiches', 
      rating: '4.0', 
      deliveryTime: '15-20 min',
      icon: '🥪',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'rest5', 
      name: 'Pizza Hut', 
      cuisine: 'Pizza', 
      rating: '4.1', 
      deliveryTime: '25-30 min',
      icon: '🍕',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: 'rest6', 
      name: 'Burger King', 
      cuisine: 'Burgers', 
      rating: '4.0', 
      deliveryTime: '30-35 min',
      icon: '🍔',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const menuItems = {
    rest1: [
      { id: 'item1', name: 'Big Mac', price: 199, description: 'Two all-beef patties, special sauce, lettuce, cheese' },
      { id: 'item2', name: 'McChicken', price: 149, description: 'Crispy chicken patty with mayo and lettuce' },
      { id: 'item3', name: 'French Fries', price: 89, description: 'Golden crispy french fries' },
      { id: 'item4', name: 'McFlurry', price: 99, description: 'Creamy soft serve with your choice of topping' }
    ],
    rest2: [
      { id: 'item5', name: 'Hot Wings (6 pcs)', price: 299, description: 'Spicy chicken wings with signature sauce' },
      { id: 'item6', name: 'Zinger Burger', price: 179, description: 'Spicy chicken fillet with fresh lettuce' },
      { id: 'item7', name: 'Popcorn Chicken', price: 149, description: 'Bite-sized crispy chicken pieces' },
      { id: 'item8', name: 'Chicken Bucket', price: 399, description: '8 pieces of original recipe chicken' }
    ],
    rest3: [
      { id: 'item9', name: 'Margherita Pizza', price: 249, description: 'Classic tomato and mozzarella pizza' },
      { id: 'item10', name: 'Pepperoni Pizza', price: 299, description: 'Spicy pepperoni with melted cheese' },
      { id: 'item11', name: 'Veg Supreme Pizza', price: 279, description: 'Loaded with fresh vegetables' },
      { id: 'item12', name: 'Chicken Supreme Pizza', price: 329, description: 'Tender chicken with vegetables' }
    ],
    rest4: [
      { id: 'item13', name: 'Italian BMT', price: 199, description: 'Pepperoni, salami, and ham with cheese' },
      { id: 'item14', name: 'Chicken Teriyaki', price: 179, description: 'Grilled chicken with teriyaki sauce' },
      { id: 'item15', name: 'Veggie Delite', price: 149, description: 'Fresh vegetables with your choice of bread' },
      { id: 'item16', name: 'Tuna Sub', price: 189, description: 'Tuna salad with fresh vegetables' }
    ],
    rest5: [
      { id: 'item17', name: 'Pan Pizza Margherita', price: 299, description: 'Thick crust with tomato and cheese' },
      { id: 'item18', name: 'Stuffed Crust Pepperoni', price: 349, description: 'Cheese-stuffed crust with pepperoni' },
      { id: 'item19', name: 'Chicken Tikka Pizza', price: 329, description: 'Spicy chicken tikka with onions' },
      { id: 'item20', name: 'Veggie Supreme Pizza', price: 279, description: 'Mixed vegetables on thin crust' }
    ],
    rest6: [
      { id: 'item21', name: 'Whopper', price: 199, description: 'Flame-grilled beef patty with fresh vegetables' },
      { id: 'item22', name: 'Chicken Royale', price: 179, description: 'Crispy chicken fillet with mayo' },
      { id: 'item23', name: 'Fish Royale', price: 189, description: 'Fish fillet with tartar sauce' },
      { id: 'item24', name: 'Onion Rings', price: 99, description: 'Crispy golden onion rings' }
    ]
  };

  const addToCart = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const removeFromCart = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant || selectedItems.length === 0 || !deliveryAddress) {
      setError('Please select restaurant, add items, and provide delivery address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setMessage(`🍕 Order placed successfully! Your food will be delivered in 25-30 minutes`);
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
            <span className="text-3xl">🍕</span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 mb-4">
            Food Delivery
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Order from your favorite restaurants and get delicious food delivered to your doorstep
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurants List */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-cyan-100 mb-6">Choose Restaurant</h2>
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedRestaurant === restaurant.id
                      ? `bg-gradient-to-r ${restaurant.color} border-transparent text-white shadow-lg`
                      : 'bg-slate-800 border-slate-600 text-cyan-100 hover:border-orange-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{restaurant.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold">{restaurant.name}</h3>
                      <p className="text-sm opacity-80">{restaurant.cuisine}</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <span>⭐ {restaurant.rating}</span>
                        <span>•</span>
                        <span>🚚 {restaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Menu Items */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            {selectedRestaurant ? (
              <div>
                <h2 className="text-2xl font-bold text-cyan-100 mb-6">Menu</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {menuItems[selectedRestaurant]?.map((item) => (
                    <div key={item.id} className="bg-slate-800 rounded-xl p-4 border border-slate-600">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-cyan-100">{item.name}</h3>
                        <span className="text-green-400 font-bold">₹{item.price}</span>
                      </div>
                      <p className="text-sm text-purple-200 mb-3">{item.description}</p>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <p className="text-purple-200">Select a restaurant to view menu</p>
              </div>
            )}
          </motion.div>

          {/* Cart & Checkout */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-cyan-100 mb-6">Your Order</h2>
            
            {selectedItems.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-600 max-h-64 overflow-y-auto">
                  {selectedItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center py-2 border-b border-slate-600 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-semibold text-cyan-100">{item.name}</h4>
                        <span className="text-green-400 font-bold">₹{item.price}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-cyan-100">Total:</span>
                    <span className="text-2xl font-bold text-green-400">₹{getTotalPrice()}</span>
                  </div>
                  <div className="text-sm text-purple-200">
                    {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} • Delivery: ₹30
                  </div>
                </div>

                <form onSubmit={handleOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-100 mb-2">Delivery Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="w-full p-3 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-purple-300"
                      rows="3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Placing Order...
                      </div>
                    ) : (
                      '🍕 Place Order'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <p className="text-purple-200">Your cart is empty</p>
                <p className="text-sm text-purple-300">Add items from the menu</p>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="mt-4 p-3 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
                <div className="flex items-center">
                  <div className="text-red-300 text-sm mr-2">❌</div>
                  <div className="text-red-100 text-sm">{error}</div>
                </div>
              </div>
            )}

            {message && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-800 to-emerald-900 border border-green-500 rounded-xl">
                <div className="flex items-center">
                  <div className="text-green-300 text-sm mr-2">✅</div>
                  <div className="text-green-100 text-sm">{message}</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-6 border border-orange-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-orange-100 mb-2">Fast Delivery</h3>
              <p className="text-orange-200">Get your food delivered in 25-30 minutes</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border border-green-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-green-100 mb-2">Great Offers</h3>
              <p className="text-green-200">Exclusive discounts and cashback on every order</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 border border-purple-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Fresh Food</h3>
              <p className="text-purple-200">Only the freshest ingredients from top restaurants</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
