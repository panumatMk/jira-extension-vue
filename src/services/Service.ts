import { store } from "@/store/Store";
import { tap } from "rxjs";
import { UserServices } from "@/services/UserServices";

export namespace Service {
  export function testConnection$() {
    return UserServices.getCurrentUser()
      .pipe(
        tap(({ response }) => {
          console.log("testConnection$", response);
          store.mySelf.name = response?.name;
        })
      );
  }
}
