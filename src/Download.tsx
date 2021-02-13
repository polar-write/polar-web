import React from 'react';
import {ChevronLeft, ChevronRight} from 'react-feather';

import mobileImage from './images/polar-mobile.jpeg';
import desktopImage from './images/polar-desktop.jpeg';
import { useWindowSize } from './util';
import { useStore } from './store';

const Download = () => {
  const {showList, toggleShowList} = useStore();
  const windowSize = useWindowSize();
  const isMobile = (windowSize.width && windowSize.width < 769);

  return (
    <div className="default-wrapper download-wrapper">
      {isMobile && (
        <button className="back-button" onClick={() => toggleShowList(!showList)}>
          {!showList ? <ChevronLeft /> : <ChevronRight />}
        </button>
      )}
      <div className="download-row">
        <div className="download-col">
          <h2>Polar for Mobile</h2>
          <img src={mobileImage} alt="polar-mobile" />
          <div className="download-buttons">
            <button>Android</button>
            <button>iPhone and iPad</button>
          </div>
        </div>
        <div className="download-col">
          <h2>Polar for Desktop</h2>
          <img src={desktopImage} alt="polar-desktop" />
          <div className="download-buttons">
            <button>Mac</button>
            <button>Windows</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Download;
