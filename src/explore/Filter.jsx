import React from "react";

const FilterForm = ({
  searchTerm,
  setSearchTerm,
  minEth,
  setMinEth,
  maxEth,
  setMaxEth,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  handleFilter,
}) => {
  return (
    <div className="filter-card">
      <input
        type="text"
        placeholder="Search title or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="price-range">
        <input
          type="number"
          placeholder="Min ETH"
          value={minEth}
          onChange={(e) => setMinEth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max ETH"
          value={maxEth}
          onChange={(e) => setMaxEth(e.target.value)}
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
        <option value="Sports">Sports</option>
      </select>

      <button className="execute-filter-btn" onClick={handleFilter}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterForm;
