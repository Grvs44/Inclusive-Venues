import { AuthenticationType } from 'azure-maps-control'
import type { IAzureMapOptions } from 'react-azure-maps'

const mapOptions: IAzureMapOptions = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: import.meta.env.VITE_AZURE_MAP_KEY,
  },
}

export default mapOptions
