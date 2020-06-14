import { FilterOption, FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import _ from "lodash"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilterType, aggregationFromFilterType } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface TimePeriodOptionsScreenProps {
  navigator: NavigatorIOS
}

export const TimePeriodOptionsScreen: React.SFC<TimePeriodOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, aggregations } = useContext(ArtworkFilterContext)

  // TODO: a lot of redundant types, see if we can clean up
  const displayValue: Record<string, string> = {
    "2010": "2010-today",
    "2000": "2000-2009",
    "1990": "1990-1999",
    "1980": "1980-1989",
    "1970": "1970-1979",
    "1960": "1960-1969",
    "1950": "1950-1959",
    "1940": "1940-1949",
    "1930": "1930-1939",
    "1920": "1920-1929",
    "1910": "1910-1919",
    "1900": "1900-1909",
    "Late 19th century": "Late 19th Century",
    "Mid 19th century": "Mid 19th Century",
    "Early 19th century": "Early 19th Century",
  }

  const filterType = FilterType.timePeriod
  const paramName = FilterParamName.timePeriod

  const aggregation = aggregationForFilterType(filterType, aggregations!)
  const options = aggregation.counts.map(aggCount => aggCount.value)
  const aggFilterOptions: FilterData[] = _.compact(
    options.map(value => {
      const displayText = displayValue[value]
      if (Boolean(displayText)) {
        return { displayText, paramValue: value, paramName, filterType }
      } else {
        return undefined
      }
    })
  )
  const allOption: FilterData = { displayText: "All", paramName, filterType }
  const filterOptions = [allOption].concat(aggFilterOptions)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)!

  const selectOption = (option: FilterData) => {
    dispatch({ type: "selectFilters", payload: option })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Time Period"
      filterOptions={filterOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
