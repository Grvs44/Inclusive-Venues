import React from 'react'
import type { VenueSubcategory } from '../redux/types'

export type Filters = {
  subcategories: VenueSubcategory[]
  addSubcategories: (subs: VenueSubcategory[]) => void
  removeSubcategories: (subs: VenueSubcategory[]) => void
  location: string
  setLocation: (location: string) => void
  getFilters: () => Object
}

export type FilterProviderProps = {
  children?: React.ReactNode
}

const FilterContext = React.createContext<Filters | undefined>(undefined)

export const useFilters = () => React.useContext(FilterContext)

export default function FilterProvider(props: FilterProviderProps) {
  const [subcategories, setSubcategories] = React.useState<VenueSubcategory[]>(
    [],
  )
  const [location, setLocation] = React.useState<string>('')

  const addSubcategories: Filters['addSubcategories'] = (subs) =>
    setSubcategories((subcategories) => subcategories.concat(subs))

  const removeSubcategories: Filters['removeSubcategories'] = (subs) =>
    setSubcategories((subcategories) =>
      subcategories.filter((s) => !subs.includes(s)),
    )

  const getFilters: Filters['getFilters'] = () => ({
    subcategory: subcategories.map((s) => s.id).join(','),
    location: location ? location : undefined,
  })

  const value: Filters = {
    subcategories,
    addSubcategories,
    removeSubcategories,
    location,
    setLocation,
    getFilters,
  }

  return (
    <FilterContext.Provider value={value}>
      {props.children}
    </FilterContext.Provider>
  )
}
