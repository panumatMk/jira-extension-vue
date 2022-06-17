import { Observable, ReplaySubject } from "rxjs";

export function useGetLocalStorage<T>(keys: string[]): Observable<T> {
  const obs = new ReplaySubject();
  chrome.storage?.local.get(keys, (value: any) => {
    obs.next(value);
  });
  return obs.asObservable() as Observable<T>;
}

export function useSetLocalStorage(data: {[p in string]: any}): Observable<any> {
  const obs = new ReplaySubject();
  chrome.storage?.local.set(data, (value: any) => {
    obs.next(value);
  });
  return obs.asObservable();
}

export function useRemoveLocalStorage(keys: string[]): Observable<any> {
  const obs = new ReplaySubject();
  chrome.storage?.local.remove(keys, (value: any) => {
    obs.next(value);
  });
  return obs.asObservable();
}
