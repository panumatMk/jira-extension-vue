import { store } from "@/store/Store";
import { tap } from "rxjs";
import { UserServices } from "@/services/UserServices";

export namespace Service {
  export function testConnection$() {
    return UserServices.getCurrentUser()
      .pipe(
        tap(({ response }) => {
          store.mySelf.name = response?.name;
        })
      );
  }
}
