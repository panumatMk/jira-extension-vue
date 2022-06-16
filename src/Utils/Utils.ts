import { useGetLocalStorage, useSetLocalStorage } from "@/google/Google";
import { map, Observable, take } from "rxjs";

export interface Ticket {
  id: string,
  label?: string,
  timeSpent: string,
  comment: string
}

export namespace JIRA {
  export function getTickets(): Observable<Ticket[]> {
    return useGetLocalStorage<{ tickets: Ticket[] }>(["tickets"])
      .pipe(
        take(1),
        map((value) => value.tickets)
      );
  }

  export function updateTickets(data: Ticket[]) {
    useSetLocalStorage({ tickets: data }).subscribe();
  }
}
