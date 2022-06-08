import { ReplaySubject } from "rxjs";

export function useGetLocalStorage(keys: string[]) {
  const obs = new ReplaySubject();
  chrome.storage.local.get(keys, (value: any) => {
    obs.next(value);
  });
  return obs.asObservable();
}

export function useSetLocalStorage(data: {[p in string]: any}) {
  const obs = new ReplaySubject();
  chrome.storage.local.set(data, (value: any) => {
    obs.next(value);
  });
  return obs .asObservable();
}
