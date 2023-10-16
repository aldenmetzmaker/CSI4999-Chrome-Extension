import React, { useState } from 'react'
import './App.css'
import ResultsCard from '../components/ResultsCard'


function App() {
  // const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSearch = () => {
  //   if (search.length > 0) {
  //     setLoading(false);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   setSearch(e.target.value);
  // };

  // const onCardClick = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  return (
    <div className='popup'>
      <div className='search-wrapper'>
        <h2 className='title-text text--lg'>(Topic Name Here)</h2>
        {!loading ? (<div className='results'>
          <ResultsCard
            title='Sample Title'
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
          />
          <ResultsCard
            title='Sample Title'
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
          />
          <ResultsCard
            title='Sample Title'
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
          />
          <ResultsCard
            title='Sample Title'
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
          />
        </div>) : ('insert loading indicator here')}

      </div>
    </div>
  );
}

export default App;