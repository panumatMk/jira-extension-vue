import { useGetLocalStorage, useSetLocalStorage } from "@/google/Google";
import { map, Observable, take } from "rxjs";
import moment from 'moment';

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

export namespace Utils {
  export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
}

export namespace DateUtils {
  export const DATE_VAR = "{{calendarDate}}"
  export function getSendingDate(date: Date) {
    date.setHours(12, 0, 0, 0);
    const dateString = date.toISOString();
    return dateString.replace('Z', '+0000');
  }

  export function getSendingDates(dates: Date[]){
    return dates.map(date => getSendingDate(date));
  }

  export function getCommentDate(value:string){
    return moment(String(value)).format('MM/DD/YYYY')
  }
}
