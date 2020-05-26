import { Flex } from "@artsy/palette"
import { ColorOption, OrderedColorFilters } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import { ceil } from "lodash"
import React, { useContext, useState } from "react"
import { FlatList, LayoutChangeEvent, NavigatorIOS, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import { ColorSwatch } from "./ColorSwatch"
import { ArtworkFilterHeader } from "./FilterHeader"

interface ColorOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ColorOptionsScreen: React.SFC<ColorOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)
  const [numColumns, setNumColumns] = useState(1)

  const filterType = "color"

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as ColorOption

  const selectOption = (option: ColorOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  const handleBackNavigation = () => {
    navigator.pop()
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    // const { width } = event.nativeEvent.layout
    // const itemWidth = 20
    // const columns = Math.floor( width / itemWidth )
    // setNumColumns(columns)
  }

  const columnCount = ceil(OrderedColorFilters.length / 2)

  return (
    <View onLayout={handleLayout}>
      <Flex flexGrow={1}>
        <ArtworkFilterHeader filterName={"Color"} handleBackNavigation={handleBackNavigation} />
        <Flex mb="125px">
          <FlatList<ColorOption>
            initialNumToRender={OrderedColorFilters.length}
            keyExtractor={(_item, index) => String(index)}
            numColumns={columnCount}
            key={numColumns}
            data={OrderedColorFilters}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ColorContainer>
                <ColorSwatch size={32} colorName={item} />
              </ColorContainer>
            )}
          />
        </Flex>
      </Flex>
    </View>
  )
}

export const ColorContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`
