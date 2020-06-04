import {
  FilterOption,
  OrderedTimePeriodFilters,
  TimePeriodOption,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import _ from "lodash"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationFromFilterType } from "../FilterModal"
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

  const filterType: FilterOption = "majorPeriods"

  const aggregationName = aggregationFromFilterType(filterType)
  const aggregation = aggregations!.filter(value => value.slice === aggregationName)[0]
  // TODO: Can I just pass both the display value and the relay param value here rather than worrying about mapping
  // between the two later?
  // What is downside?
  // lot of refactoring for other options
  // instead could just get the display value here and pass as option, seems to be what is expected
  const options = aggregation.counts.map(aggCount => aggCount.value)
  const aggregateDisplayOptions = _.compact(options.map(value => displayValue[value]))
  const displayOptions = ["All"].concat(aggregateDisplayOptions)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as TimePeriodOption

  const selectOption = (option: TimePeriodOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterText="Time Period"
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
