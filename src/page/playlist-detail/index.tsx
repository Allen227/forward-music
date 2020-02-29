import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {playlistDetailType, songUrlType} from '../../types/playlist';
import './style.pcss';
import AudioPlayer from '../../plugin/audioPlayer/index';
import { Scrollbars } from 'react-custom-scrollbars';
interface Props {
  fetchPlaylistDetail: Function,
  fetchSongUrl: Function,
  playlistDetail: playlistDetailType,
  songUrl: songUrlType
}

interface locationType {
  state: any
}

export default function PlaylistDetail ({fetchPlaylistDetail, playlistDetail, fetchSongUrl}: Props) {
  let location: locationType = useLocation();
  let playlistId: number = location.state.id;
  let audioDom: HTMLMediaElement = document.querySelector('#moment-audio') as HTMLMediaElement;
  /* eslint-disable */
  useEffect(() => {
    fetchPlaylistDetail(playlistId);
  }, []);

  let topInfo;
  let songslist;

  const audioPlayer = AudioPlayer.getInstance();

  async function playSong (songId: number) {
    const songUrlData = await fetchSongUrl(songId);
    if (audioDom !== void 0) {
      audioPlayer.setSrc(songUrlData.data[0].url);
      audioPlayer.load();
      audioPlayer.play();
    }
  }

  if (playlistDetail.playlist) {
    let playList = playlistDetail.playlist;
    songslist = playList.tracks.map((track, idx) => {
      let seconds = Math.floor(track.dt / 1000) % 60;
      return (
        <div className="table-row" key={track.id} onClick={() => playSong(track.id)}>
          <span className="table-cell track-index">{idx + 1}</span>
          <span className="table-cell song-name">{track.name}</span>
          <span className="table-cell song-player">{track.ar[0].name}</span>
          <span className="table-cell song-time">{`${Math.floor(track.dt / 6e4)}分${seconds < 10 ? '0' + seconds : seconds}秒`}</span>
        </div>
      )
    })
    topInfo = (
      <div className="playlist-top">
        <img className="playlist-cover" src={playList.coverImgUrl} alt="playlist cover"></img>
        <div className="playlist-info">
          <h2 className="playlist-title">{playList.name}</h2>
          <p className="playlist-desc">{playList.description}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="playlist-detail">
      <Scrollbars style={{ width: '100%', height: '100%' }} autoHide>
        {topInfo}
        <div className="table-wrapper">
          <div className="table-title">
            <div className="title-item"></div>
            <div className="title-item">歌曲</div>
            <div className="title-item">歌手</div>
            <div className="title-item">时长</div>
          </div>
          <div className="table-content">
            {songslist}
          </div>
        </div>
      </Scrollbars>
    </div>
  )
}
