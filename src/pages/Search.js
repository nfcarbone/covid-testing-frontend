import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import * as tools from '../tools/tools.js';
import { useTryCatchFinally } from '../tools/useTryCatchFinally.js';
import { App, Info, SetInfo } from '../Providers/ContextProvider.js';
import SearchForm from './Search/SearchForm.js';
import SearchResults from './Search/SearchResults.js';
import Selection from './Search/Selection.js';

const Loading = () => <h1>Loading...</h1>;

const Search = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const { loading, error } = useContext(App);
  const { searchResults, prevSearch } = useContext(Info);
  const setInfo = useContext(SetInfo);

  const tryCatchFinally = useTryCatchFinally();

  const [date, setDate] = useState(tools.TODAY);
  const [selection, setSelection] = useState(null);

  const search = (...tryArgs) => {
    tryCatchFinally(tryFunc, tryArgs);
    async function tryFunc(tests, zip, date, sortBy = 'distance') {
      history.push(`${url}/results`);
      let locations = await tools.getLocations();
      locations = await tools.getDistances(zip, locations);
      let filtered = tools.filterLocationsBy('tests', tests, locations);
      tools.addAvailableTimes(filtered, date);
      tools.sortLocationsBy(sortBy, filtered);
      setInfo((prevState) => ({
        ...prevState,
        allLocations: locations,
        searchResults: filtered,
        prevSearch: { tests, zip, sortBy },
      }));
    }
  };

  const handleSortBy = (sortBy) => {
    let results = [...searchResults];
    tools.sortLocationsBy(sortBy, results);
    setInfo((prevState) => ({
      ...prevState,
      searchResults: results,
      prevSearch: { ...prevState.prevSearch, sortBy },
    }));
  };

  const handleChangeDate = (type) => {
    const newDate = tools.changeDate(type, date);
    let newResults = [...searchResults];
    tools.addAvailableTimes(newResults, newDate);
    tools.sortLocationsBy(prevSearch.sortBy, newResults);
    setInfo((prevState) => ({ ...prevState, searchResults: newResults }));
    setDate(newDate);
  };

  const getSelected = useCallback(
    (selected) => {
      const selectedLocation = tools.getSelection(selected, searchResults);
      setSelection(selectedLocation);
    },
    [searchResults]
  );

  const handleSelection = (selected) => {
    history.push(`${url}/selection`);
    getSelected(selected);
  };

  const refreshLocations = (date) => {
    const { tests, zip, sortBy } = prevSearch;
    search(tests, zip, date, sortBy);
  };

  useEffect(() => {
    if (selection) getSelected(selection._id);
  }, [selection, getSelected]);

  return (
    <>
      {/* {loading && <Loading />} */}
      {error && <h1>{error}</h1>}
      <Route path={`${url}/form`}>
        <SearchForm handleSubmit={search} />
      </Route>
      <Route path={`${url}/results`}>
        <SearchResults
          searchResults={searchResults}
          date={date}
          handleSortBy={handleSortBy}
          handleChangeDate={handleChangeDate}
          handleSelection={handleSelection}
        />
      </Route>

      <Route path={`${url}/selection`}>
        <Selection
          selection={selection}
          date={date}
          refreshLocations={refreshLocations}
          handleChangeDate={handleChangeDate}
        />
      </Route>
    </>
  );
};

export default Search;
