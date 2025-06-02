import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoZone, GeoZoneCreate } from '../models/geo-zone.model';

@Injectable({
  providedIn: 'root'
})
export class GeoZoneService {
  private apiUrl = '/api/geozones'; // Assuming this is the base URL

  constructor(private http: HttpClient) {}

  getGeoZones(skip?: number, limit?: number): Observable<GeoZone[]> {
    let params = new HttpParams();
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<GeoZone[]>(this.apiUrl, { params });
  }

  getGeoZone(id: number): Observable<GeoZone> {
    return this.http.get<GeoZone>(`${this.apiUrl}/${id}`);
  }

  createGeoZone(geoZoneData: GeoZoneCreate): Observable<GeoZone> {
    return this.http.post<GeoZone>(this.apiUrl, geoZoneData);
  }

  updateGeoZone(id: number, geoZoneData: GeoZoneCreate): Observable<GeoZone> { // GeoZoneCreate or a new GeoZoneUpdate interface
    return this.http.put<GeoZone>(`${this.apiUrl}/${id}`, geoZoneData);
  }

  deleteGeoZone(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
