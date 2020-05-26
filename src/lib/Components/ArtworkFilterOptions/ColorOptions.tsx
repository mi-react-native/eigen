import { Flex } from "@artsy/palette"
import { ColorOption, OrderedColorFilters } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext, useState } from "react"
import { LayoutChangeEvent, NavigatorIOS, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import { ColorSwatch } from "./ColorSwatch"
import { ArtworkFilterHeader } from "./FilterHeader"

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

  const handleLayout = (event: LayoutChangeEvent) => {
    // const { width } = event.nativeEvent.layout
    // const itemWidth = 20
    // const columns = Math.floor( width / itemWidth )
    // setNumColumns(columns)
  }

  return (
    <View onLayout={handleLayout}>
      <Flex flexGrow={1}>
        <ArtworkFilterHeader filterName={"Color"} handleBackNavigation={handleBackNavigation} />
        <Flex flexWrap="wrap" flexDirection="row" mb="125px">
          {OrderedColorFilters.map((item, index) => {
            return (
              <ColorContainer key={index}>
                <ColorSwatch size={32} colorName={item} index={index} />
              </ColorContainer>
            )
          })}
        </Flex>
      </Flex>
    </View>
  )
}

export const ColorContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`
