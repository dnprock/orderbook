// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// mock web socket library
jest.mock('websocket', () => {
  class IMessageEvent {

  }
  class wsocket {
    onopen() {
    }
    onmessage(message: IMessageEvent) {
    }
    send(message: string) {
    }
    close() {
    }
  }
  return {
    w3cwebsocket: wsocket
  }
})