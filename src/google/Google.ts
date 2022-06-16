import { Observable, ReplaySubject } from "rxjs";

export function useGetLocalStorage<T>(keys: string[]): Observable<T> {
  const obs = new ReplaySubject();
  chrome.storage?.local.get(keys, (value: any) => {
    obs.next(value);
  });
  return obs.asObservable() as Observable<T>;
}

export function useSetLocalStorage(data: {[p in string]: any}): Observable<any> {
  console.log(data);
  const obs = new ReplaySubject();
  chrome.storage?.local.set(data, (value: any) => {
    obs.next(value);
  });
  return obs.asObservable();
}
