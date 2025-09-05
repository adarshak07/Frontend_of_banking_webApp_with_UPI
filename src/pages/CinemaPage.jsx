import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CinemaPage() {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const movies = [
    { id: 'movie1', title: 'Avengers: Endgame', genre: 'Action', duration: '3h 1m', rating: '9.2', poster: '🎬' },
    { id: 'movie2', title: 'Spider-Man: No Way Home', genre: 'Action', duration: '2h 28m', rating: '8.8', poster: '🕷️' },
    { id: 'movie3', title: 'Top Gun: Maverick', genre: 'Action', duration: '2h 11m', rating: '8.6', poster: '✈️' },
    { id: 'movie4', title: 'Dune', genre: 'Sci-Fi', duration: '2h 35m', rating: '8.0', poster: '🏜️' },
    { id: 'movie5', title: 'The Batman', genre: 'Action', duration: '2h 56m', rating: '7.8', poster: '🦇' },
    { id: 'movie6', title: 'Encanto', genre: 'Animation', duration: '1h 42m', rating: '7.3', poster: '🎭' }
  ];

  const cinemas = [
    { id: 'cinema1', name: 'PVR Cinemas', location: 'Mall of India', distance: '2.5 km' },
    { id: 'cinema2', name: 'INOX Leisure', location: 'Select City Walk', distance: '3.2 km' },
    { id: 'cinema3', name: 'Cinepolis', location: 'DLF Mall', distance: '4.1 km' },
    { id: 'cinema4', name: 'Miraj Cinemas', location: 'Pacific Mall', distance: '5.8 km' }
  ];

  const timeSlots = ['10:00 AM', '1:30 PM', '4:00 PM', '7:30 PM', '10:00 PM'];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedMovie || !selectedCinema || !selectedDate || !selectedTime) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setMessage(`🎬 Booking successful! ${tickets} ticket(s) booked for ${selectedMovie} at ${selectedCinema}`);
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 mb-4">
            Cinema Booking
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Book your movie tickets instantly with the best seats and exclusive offers
          </p>
        </motion.div>

        {/* Movies Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-cyan-100 mb-8">Now Showing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie.title)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  selectedMovie === movie.title
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 border-transparent text-white shadow-2xl'
                    : 'bg-slate-800 border-slate-600 text-cyan-100 hover:border-red-500'
                }`}
              >
                <div className="text-4xl mb-4 text-center">{movie.poster}</div>
                <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                <div className="space-y-1 text-sm opacity-80">
                  <p>Genre: {movie.genre}</p>
                  <p>Duration: {movie.duration}</p>
                  <p>Rating: ⭐ {movie.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-3xl shadow-2xl p-8 border border-slate-600"
        >
          <h2 className="text-3xl font-bold text-cyan-100 mb-8">Book Your Tickets</h2>
          
          <form onSubmit={handleBooking} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cinema Selection */}
              <div>
                <label className="block text-lg font-semibold text-cyan-100 mb-3">Select Cinema</label>
                <div className="space-y-3">
                  {cinemas.map((cinema) => (
                    <button
                      key={cinema.id}
                      type="button"
                      onClick={() => setSelectedCinema(cinema.name)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedCinema === cinema.name
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white'
                          : 'bg-slate-700 border-slate-600 text-cyan-100 hover:border-blue-500'
                      }`}
                    >
                      <div className="font-semibold">{cinema.name}</div>
                      <div className="text-sm opacity-80">{cinema.location}</div>
                      <div className="text-sm opacity-60">{cinema.distance} away</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-cyan-100 mb-3">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-4 border-2 border-indigo-500 bg-slate-700 text-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-cyan-100 mb-3">Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedTime === time
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-transparent text-white'
                            : 'bg-slate-700 border-slate-600 text-cyan-100 hover:border-green-500'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets Count */}
            <div>
              <label className="block text-lg font-semibold text-cyan-100 mb-3">Number of Tickets</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setTickets(Math.max(1, tickets - 1))}
                  className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-bold text-xl"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-cyan-100 min-w-[3rem] text-center">{tickets}</span>
                <button
                  type="button"
                  onClick={() => setTickets(tickets + 1)}
                  className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-cyan-100">Total Amount:</span>
                <span className="text-3xl font-bold text-green-400">₹{tickets * 200}</span>
              </div>
              <div className="text-sm text-purple-200 mt-2">
                ₹200 per ticket × {tickets} ticket{tickets > 1 ? 's' : ''}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Booking Tickets...
                </div>
              ) : (
                '🎬 Book Now'
              )}
            </button>
          </form>

          {/* Messages */}
          {error && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-800 to-pink-900 border border-red-500 rounded-xl">
              <div className="flex items-center">
                <div className="text-red-300 text-lg mr-2">❌</div>
                <div className="text-red-100 font-medium">{error}</div>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-800 to-emerald-900 border border-green-500 rounded-xl">
              <div className="flex items-center">
                <div className="text-green-300 text-lg mr-2">✅</div>
                <div className="text-green-100 font-medium">{message}</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl p-6 border border-red-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎫</span>
              </div>
              <h3 className="text-xl font-bold text-red-100 mb-2">Best Seats</h3>
              <p className="text-red-200">Choose from the best available seats in the house</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 border border-purple-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Great Offers</h3>
              <p className="text-purple-200">Exclusive discounts and cashback on every booking</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl p-6 border border-blue-500 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-blue-100 mb-2">Mobile Tickets</h3>
              <p className="text-blue-200">Get digital tickets delivered instantly to your phone</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
