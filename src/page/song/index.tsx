import React, {useEffect, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {wordType} from '../../types/index';
import parseTime from '../../plugin/parseTime';
import {currentTimeContext} from '../../plugin/currentTimeContext';
import './style.pcss';

interface locationType {
  state: any
}

interface Props {
  currentTime: number,
  fetchLyric: Function,
  lyricData: any
}

let parsedResult: any = [];
// get current line that is active of lyric
const getActiveIndex = (function () {
  let preIndex = 0;
  return function getActiveIndex (search: string) {
    let index = 0;
    let resultIndex: number | undefined = void 0;
    for (let currentLine of parsedResult) {
      if (currentLine.time.includes(search)) {
        resultIndex = index;
        break;
      }
      index++;
    }
    if (resultIndex === void 0) {
      resultIndex = preIndex;
    } else {
      preIndex = resultIndex;
    }
    return resultIndex;
  }
})();

export default function Song ({fetchLyric, lyricData}: Props) {
  let location: locationType = useLocation();
  let timeContext = useContext(currentTimeContext);
  const songId = location.state.id;
  // fetch lyric
  /* eslint-disable */
  useEffect(() => {
    fetchLyric(songId);
  }, []);
  let lyricStr: string = '';
  if (lyricData && lyricData.lrc) {
    lyricStr = lyricData.lrc.lyric;
  }
  // initial parsedResult
  parsedResult = [];
  /** parse lyric **/
  parsedResult = (function parseWord() {
    // split string for get LYRIC array
    const lyricArr = lyricStr.split('\n');
    let matchInfo: any = [];
    // listen audio time
    lyricArr.map(line => {
      matchInfo = line.match(/\[\d{2}:\d{2}.(\d{2}|\d{3})\]/);
      if (matchInfo) {
        // push into result stack
        parsedResult.push({
          time: matchInfo[0].slice(1, -1),
          value: line.slice(matchInfo[0].length).trim()
        })
      }
    });
    return parsedResult;
  })();
  // get node of lyric
  let lyricDom = parsedResult.map((word: wordType, index: number) => {
    const lyricStyle = ['word-item'];
    if (getActiveIndex(parseTime(timeContext.value * 1e3)) === index) {
      lyricStyle.push('active');
    }
    return (
      <li className={lyricStyle.join(' ')} key={index}>{word.value}</li>
    )
  })
  return (
    <div>
      <ul className="word-list">{lyricDom}</ul>
    </div>
  )
}