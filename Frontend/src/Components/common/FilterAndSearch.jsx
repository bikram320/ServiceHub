import React from 'react';
import { Filter, RefreshCw, Search, SortAsc, SortDesc } from 'lucide-react';
import styles from '../../styles/FilterAndSearch.module.css';

const FilterAndSearch = ({
                             searchTerm,
                             onSearchChange,
                             selectedFilter,
                             onFilterChange,
                             filterOptions,
                             sortBy,
                             onSortByChange,
                             sortOrder,
                             onSortOrderChange,
                             onRefresh,
                             sortOptions = [
                                 { value: 'date', label: 'Date' },
                                 { value: 'price', label: 'Price' },
                                 { value: 'distance', label: 'Distance' },
                                 { value: 'priority', label: 'Priority' }
                             ]
                         }) => {
    return (
        <section className={styles['form-section']}>
            <div className={styles['section-header']}>
                <h3 className={styles['section-title']}>
                    <Filter size={20} style={{marginRight: '0.5rem'}} />
                    Filter & Search
                </h3>
                <div className={styles['filter-controls']}>
                    <button
                        className={`${styles['action-btn']} ${styles['secondary']}`}
                        onClick={onRefresh}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className={styles['filter-section']}>
                <div className={styles['search-container']}>
                    <div className={styles['search-input-wrapper']}>
                        <Search size={20} className={styles['search-icon']} />
                        <input
                            type="text"
                            placeholder="Search by client name, service type, or location..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={styles['search-input']}
                        />
                    </div>
                </div>

                <div className={styles['filter-tabs-and-sort']}>
                    <div className={styles['filter-tabs']}>
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                className={`${styles['filter-tab']} ${selectedFilter === option.value ? styles['active'] : ''}`}
                                onClick={() => onFilterChange(option.value)}
                            >
                                {option.label}
                                <span className={styles['filter-count']}>
                                    {option.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className={styles['sort-controls']}>
                        <label className={styles['sort-label']}>Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortByChange(e.target.value)}
                            className={styles['sort-select']}
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button
                            className={styles['sort-order-btn']}
                            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FilterAndSearch;