import { Box, CheckIcon, color, Flex, Sans, space } from "@artsy/palette"
import { ColorOption, OrderedColorFilters } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { FlatList, NavigatorIOS, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { ArtworkFilterHeader } from "./FilterHeader"
import { OptionListItem } from "./MultiSelectOption"

interface ColorOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ColorOptionsScreen: React.SFC<ColorOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const filterType = "color"

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as ColorOption

  const selectOption = (option: ColorOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  const handleBackNavigation = () => {
    navigator.pop()
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterHeader filterName={"Color"} handleBackNavigation={handleBackNavigation} />
      <Flex mb="125px">
        <FlatList<ColorOption>
          initialNumToRender={20}
          keyExtractor={(_item, index) => String(index)}
          data={OrderedColorFilters}
          renderItem={({ item }) => (
            <Box>
              {
                <SingleSelectOptionListItemRow onPress={() => selectOption(item)}>
                  <OptionListItem>
                    <InnerOptionListItem>
                      <Option color="black100" size="3t">
                        {item}
                      </Option>
                      {item === selectedOption && (
                        <Box mb={0.1}>
                          <CheckIcon fill="black100" />
                        </Box>
                      )}
                    </InnerOptionListItem>
                  </OptionListItem>
                </SingleSelectOptionListItemRow>
              }
            </Box>
          )}
        />
      </Flex>
    </Flex>
  )
}

export const FilterHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: ${space(2)}px;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
`
export const NavigateBackIconContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-end;
  padding: ${space(2)}px;
`

export const SingleSelectOptionListItemRow = styled(TouchableOpacity)``
export const Option = styled(Sans)``
