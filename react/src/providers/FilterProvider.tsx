import React from 'react'
import type { VenueSubcategory } from '../redux/types'

export type Filters = {
  subcategories: VenueSubcategory[]
  addSubcategories?: (subs: VenueSubcategory[]) => void
  removeSubcategories?: (subs: VenueSubcategory[]) => void
}

export type FilterProviderProps = {
  children: React.ReactNode
}

const FilterContext = React.createContext<Filters>({
  subcategories: [],
})

export const useFilters = () => React.useContext(FilterContext)

export default function FilterProvider(props: FilterProviderProps) {
  const [subcategories, setSubcategories] = React.useState<VenueSubcategory[]>(
    [],
  )
  const addSubcategories: Filters['addSubcategories'] = (subs) =>
    setSubcategories((subcategories) => subcategories.concat(subs))
  const removeSubcategories: Filters['removeSubcategories'] = (subs) =>
    setSubcategories((subcategories) =>
      subcategories.filter((s) => !subs.includes(s)),
    )
  const value: Filters = {
    subcategories,
    addSubcategories,
    removeSubcategories,
  }
  return (
    <FilterContext.Provider value={value}>
      {props.children}
    </FilterContext.Provider>
  )
}
