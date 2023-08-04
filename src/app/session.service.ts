import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly sessionIdKey = 'sessionId';

  constructor() {}

  getSessionId(): string {
    let sessionId = sessionStorage.getItem(this.sessionIdKey);

    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2);
      sessionStorage.setItem(this.sessionIdKey, sessionId);
    }

    return sessionId;
  }
}
