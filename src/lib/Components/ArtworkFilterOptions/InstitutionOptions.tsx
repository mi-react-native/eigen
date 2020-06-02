import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface InstitutionOptionsScreenProps {
  navigator: NavigatorIOS
}

export const InstitutionOptionsScreen: React.SFC<InstitutionOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const filterType = "institution"

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as MediumOption

  const selectOption = (option: InstitutionOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterText="Institution"
      filterOptions={OrderedInstitutionFilters}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
