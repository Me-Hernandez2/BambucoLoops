import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {SpinnerService} from "../../shared/services/spinner.service";
import {finalize, Observable} from "rxjs";


@Injectable()

export class spinnerInterceptor implements HttpInterceptor {

    constructor(private spinnerService$: SpinnerService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.spinnerService$.show();
      return next.handle(req).pipe(
          finalize( () => this.spinnerService$.hide())
      )
    }
}
