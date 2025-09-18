import React,{useState, useRef, useEffect} from 'react';
import { Search, Clock, X } from 'lucide-react';
import '../../styles/FindServices.css';

const SearchBar = () => {
    const services = [
        "Plumbing",
        "Electrician",
        "Appliances Repair",
        "Welder",
        "Painter",
        "Photographer",
        "Carpenter",
        "Movers",
        "Construction Worker",
        "Mechanic",
        "HVAC Repair",
        "Roofing",
        "Landscaping",
        "Cleaning Services",
        "Pest Control",
        "Interior Design",
        "Locksmith",
        "Glass Repair",
        "Tile Installation",
        "Drywall Repair"
    ];

    const [query, setQuery] = useState("");
    const [filteredServices, setFilteredServices] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState([
        "Plumbing repair",
        "House cleaning",
        "Electrician near me"
    ]);

    const [isFocused, setIsFocused] = useState(false);

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedIndex(-1);

        //Filter services based on user input
        if (value.trim() === "") {
            setFilteredServices([]);
        }else {
            const results = services.filter((service) =>
                service.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredServices(results.slice(0, 8));
        }
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (service) => {
        setQuery(service);
        setShowSuggestions(false);
        setSelectedIndex(-1);

        //Adds to the recent searches if not already there
        if (!recentSearches.includes(service)){
            setRecentSearches(prev => [service, ...prev.slice(0, 4)]);
        }

        //Perform search
        handleSearch(service);
    };

    const handleSearch = (searchTerm = query) => {
        if (searchTerm.trim()) {
            console.log("Searching for:", searchTerm);

            // Add to recent searches if new
            if (!recentSearches.includes(searchTerm)) {
                setRecentSearches((prev) => [searchTerm, ...prev.slice(0, 4)]);
            }

            setShowSuggestions(false);
            inputRef.current?.blur();


        }
    };

    // Handle recent search click
    const handleRecentSearch = (searchTerm) => {
        setQuery(searchTerm);
        handleSearch(searchTerm);
    };


    // Remove a recent search
    const removeRecentSearch = (searchTerm) => {
        setRecentSearches((prev) => prev.filter((item) => item !== searchTerm));
    };

    const handleKeyDown = (e) => {
        const totalItems = filteredServices.length + (query === ""? recentSearches.length : 0);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < totalItems - 1 ? prev + 1 : 0);
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : totalItems - 1);
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    if (query === "" && selectedIndex < recentSearches.length) {
                        //Selected recent searches
                        handleRecentSearch(recentSearches[selectedIndex]);

                    } else if (filteredServices.length > 0) {
                        //Selected service suggestions
                        const adjustedIndex = query === "" ? selectedIndex - recentSearches.length : selectedIndex;
                        if (adjustedIndex >= 0 && adjustedIndex < filteredServices.length) {
                            handleSuggestionClick(filteredServices[adjustedIndex]);
                        }
                    }
                } else {
                    handleSearch();
                }
                break;

            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
        };

        const handleFocus = () => {
            setIsFocused(true);
            setShowSuggestions(true);
        };

        const handleBlur = () => {
            setIsFocused(false);
            //Delays hiding
            setTimeout(() => setShowSuggestions(false), 150);
        };

        const clearQuery = () => {
            setQuery("");
            setFilteredServices([]);
            setSelectedIndex(-1);
            inputRef.current?.focus();
        };

        //close suggestion when outside is clicked
        useEffect(() => {
            const handleCLickOutside = (event) => {
                if (searchRef.current && !searchRef.current.contains(event.target)) {
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                }
            };

            document.addEventListener('mousedown', handleCLickOutside);
            return () => document.removeEventListener('mousedown', handleCLickOutside);
        }, []);

        const highlightMatch = (text, query) => {
            if (!query) return text;

            const regex = new RegExp(`(${query})` , 'gi');
            const parts = text.split(regex);

            return parts.map((part, index) =>
                regex.test(part) ? (
                    <strong key={index} className="highlight">{part}</strong>
                ): part
            );
        };

    return (
        <div className="search-container">
            {/* Search box */}
            <div className="search-wrapper" ref={searchRef}>
                <div className={`search-input-container ${isFocused ? 'focused' : ''}`}>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="What services are you looking for today?"
                        className="search-bar"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {query && (
                        <button
                            className="clear-btn"
                            onClick={clearQuery}
                            type="button"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <div className="search-icon-wrapper" onClick={() => handleSearch()}>
                        <Search className="search-icon" size={20} />
                    </div>
                </div>

                {/* Dropdown suggestions */}
                {showSuggestions && (
                    <div className="suggestions">
                        {/* Recent searches - show when input is empty */}
                        {query === "" && recentSearches.length > 0 && (
                            <>
                                <div className="suggestion-header">Recent searches</div>
                                {recentSearches.map((search, index) => (
                                    <div
                                        key={`recent-${index}`}
                                        className={`suggestion-item recent-item ${selectedIndex === index ? 'selected' : ''}`}
                                        onClick={() => handleRecentSearch(search)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <Clock size={16} className="recent-icon" />
                                        <span className="suggestion-text">{search}</span>
                                        <button
                                            className="remove-recent"
                                            onClick={(e) => removeRecentSearch(search, e)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {filteredServices.length > 0 && <div className="suggestion-divider"></div>}
                            </>
                        )}

                        {/* Service suggestions */}
                        {filteredServices.length > 0 && (
                            <>
                                {query !== "" && <div className="suggestion-header">Services</div>}
                                {filteredServices.map((service, index) => {
                                    const adjustedIndex = query === "" ? index + recentSearches.length : index;
                                    return (
                                        <div
                                            key={`service-${index}`}
                                            className={`suggestion-item ${selectedIndex === adjustedIndex ? 'selected' : ''}`}
                                            onClick={() => handleSuggestionClick(service)}
                                            onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                                        >
                                            <Search size={16} className="suggestion-icon" />
                                            <span className="suggestion-text">
                                                {highlightMatch(service, query)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {/* No results */}
                        {query !== "" && filteredServices.length === 0 && (
                            <div className="no-results">
                                <span>No services found for "{query}"</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;