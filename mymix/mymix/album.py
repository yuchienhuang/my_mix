import simplejson as json
import pandas as pd
import numpy as np
from sklearn.preprocessing import PolynomialFeatures, MinMaxScaler
import heapq

def hit_song_predictor(album, model):
    X, y = album.train_X_y()
    y_est = model.predict(X)
    indices = np.arange(album.total_tracks)[y_est]
    hit_list = album.tracks_df[[ 'track_number',  'name']].values[indices]

    y_est_prob_mtx = model.predict_proba(X)
    y_est_prob_mtx[:, 0] = np.arange(album.total_tracks)
    indices = np.array(heapq.nlargest(3, y_est_prob_mtx, key=lambda x: x[1]))[:,0].astype(int)
    
    top_three = album.tracks_df[[ 'track_number',  'name']].values[indices] 
        
    return hit_list, top_three



class Album(object):
    def __init__(self, album_json):
        self.id, self.name, self.genres, self.popularity, self.total_tracks, self.artists_list = [album_json[k] for k in ['id', 'name', 'genres', 'popularity', 'total_tracks', 'artists_list']]
        self.tracks_df = pd.read_json(album_json['tracks_info'], orient='split')

    def unit_transf(self):
        self.tracks_df['tempo'] = self.tracks_df['tempo'] / 60
        self.tracks_df['duration_ms'] = self.tracks_df['duration_ms'] / 1000 / 60
        self.tracks_df['loudness'] = self.tracks_df['loudness'] / 10
        self.tracks_df['ordering'] = MinMaxScaler().fit_transform(self.tracks_df['track_number'].values.reshape(-1,1)) - 0.5
        self.tracks_df['total_tracks'] = self.total_tracks
        
    def classification_label(self):
        self.tracks_df['label'] = self.tracks_df['popularity'] >= self.popularity
        return self.tracks_df['label'].values
        
    def train_X_y(self):
        self.unit_transf()        
        X = self.tracks_df[['mode', 'tempo', 'duration_ms', 'ordering', 'acousticness', 'danceability', 'energy', 'liveness', 'speechiness','valence']].values
        y = self.classification_label()
        return X, y