import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("all");
  const [sort, setSort] = useState("default");
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    fetch("https://demohotelsapi.pythonanywhere.com/hotels/")
      .then((response) => response.json())
      .then((result) => {
        setHotels(result.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      });
  }, []);

  let filteredHotels = hotels.filter((hotel) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      hotel.name.toLowerCase().includes(searchText) ||
      hotel.location.toLowerCase().includes(searchText);

    const matchesRating =
      rating === "all" || hotel.rating >= Number(rating);

    return matchesSearch && matchesRating;
  });

  if (sort === "low") {
    filteredHotels = [...filteredHotels].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "high") {
    filteredHotels = [...filteredHotels].sort(
      (a, b) => b.price - a.price
    );
  }

  if (sort === "rating") {
    filteredHotels = [...filteredHotels].sort(
      (a, b) => b.rating - a.rating
    );
  }

  if (loading) {
    return <h1 className="loading">Loading Hotels...</h1>;
  }

  return (
    <div className="hotel-page">
      <nav className="navbar">
        <h1 className="logo">StayFinder</h1>
        <p>Find your perfect stay</p>
      </nav>

      <section className="hero">
        <h2>Discover Amazing Hotels</h2>
        <p>Explore beautiful stays and find your next destination.</p>
      </section>

      <section className="hotels-section">
        <div className="filter-box">
          <input
            type="text"
            placeholder="Search hotel or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="4">4+ Rating</option>
            <option value="3">3+ Rating</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        <h2>Hotels ({filteredHotels.length})</h2>

        <div className="hotel-grid">
          {filteredHotels.slice(0, 20).map((hotel) => (
            <div
              className="hotel-card"
              key={hotel.id}
              onClick={() => setSelectedHotel(hotel)}
            >
              <img src={hotel.thumbnail} alt={hotel.name} />

              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="location">📍 {hotel.location}</p>

                <div className="hotel-bottom">
                  <span className="rating">⭐ {hotel.rating}</span>

                  <div className="price">
                    ₹{hotel.price}
                    <span> / night</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <p className="no-hotels">No hotels found.</p>
        )}
      </section>

      {selectedHotel && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedHotel(null)}
        >
          <div
            className="hotel-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedHotel(null)}
            >
              ×
            </button>

            <img
              className="modal-main-image"
              src={selectedHotel.thumbnail}
              alt={selectedHotel.name}
            />

            <div className="modal-content">
              <h2>{selectedHotel.name}</h2>

              <p className="location">
                📍 {selectedHotel.location}
              </p>

              <div className="modal-details">
                <span className="rating">
                  ⭐ {selectedHotel.rating}
                </span>

                <div className="price">
                  ₹{selectedHotel.price}
                  <span> / night</span>
                </div>
              </div>

              <h3>About this hotel</h3>

              <p className="description">
                {selectedHotel.description ||
                  "A beautiful hotel offering a comfortable and memorable stay."}
              </p>

              {selectedHotel.photos &&
                selectedHotel.photos.length > 0 && (
                  <>
                    <h3>Hotel Photos</h3>

                    <div className="photo-grid">
                      {selectedHotel.photos
                        .slice(0, 4)
                        .map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`${selectedHotel.name} ${index + 1}`}
                          />
                        ))}
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;