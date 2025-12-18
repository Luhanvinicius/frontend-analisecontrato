declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
          }) => void
          prompt: (notification?: (notification: any) => void) => void
          renderButton: (element: HTMLElement, options?: any) => void
        }
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token: string }) => void
          }) => {
            requestAccessToken: () => void
          }
        }
      }
    }
  }
}

export {}

