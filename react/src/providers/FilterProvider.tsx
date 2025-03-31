import React from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getLocationErrorMessage } from '../components/utils'
import type { State, VenueSubcategory } from '../redux/types'

export type Filters = {
  subcategories: VenueSubcategory[]
  addSubcategories: (subs: VenueSubcategory[]) => void
  removeSubcategories: (subs: VenueSubcategory[]) => void
  location: string
  setLocation: (location: string) => void
  radius: string
  setRadius: (radius: string) => void
  getFilters: () => Object
}

export type FilterProviderProps = {
  children?: React.ReactNode
}

const FilterContext = React.createContext<Filters | undefined>(undefined)

export const useFilters = () => React.useContext(FilterContext)

export default function FilterProvider(props: FilterProviderProps) {
  const settings = useSelector((state: State) => state.settings)
  const [subcategories, setSubcategories] = React.useState<VenueSubcategory[]>(
    [],
  )
  const [location, setLocation] = React.useState<string>('')
  const [radius, setRadius] = React.useState<string>('')

  // Apply initial settings
  React.useEffect(() => {
    if (settings.autoLocation && navigator.geolocation) {
      const id = toast.loading('Fetching your location...')
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocation(
            `${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`,
          )
          toast.dismiss(id)
        },
        (error) => {
          toast.dismiss(id)
          toast.error(
            'Error auto-detecting location:\n' + getLocationErrorMessage(error),
          )
          if (settings.defaultLocation) {
            toast('Using default location')
            setLocation(
              `${settings.defaultLocation[0]},${settings.defaultLocation[1]}`,
            )
          }
        },
      )
    } else if (settings.defaultLocation) {
      setLocation(
        `${settings.defaultLocation[0]},${settings.defaultLocation[1]}`,
      )
    }
  }, [])

  const addSubcategories: Filters['addSubcategories'] = (subs) =>
    setSubcategories((subcategories) => subcategories.concat(subs))

  const removeSubcategories: Filters['removeSubcategories'] = (subs) =>
    setSubcategories((subcategories) =>
      subcategories.filter((s) => !subs.includes(s)),
    )

  const getFilters: Filters['getFilters'] = () => ({
    subcategory: subcategories.length
      ? subcategories.map((s) => s.id).join(',')
      : undefined,
    location: location || undefined,
    radius: location ? radius || '5' : undefined,
  })

  const value: Filters = {
    subcategories,
    addSubcategories,
    removeSubcategories,
    location,
    setLocation,
    radius,
    setRadius,
    getFilters,
  }

  return (
    <FilterContext.Provider value={value}>
      {props.children}
    </FilterContext.Provider>
  )
}
