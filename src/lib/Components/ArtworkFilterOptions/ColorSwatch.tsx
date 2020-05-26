import { color, Flex } from "@artsy/palette"
import { ColorOption } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { View } from "react-native"

interface ColorSwatchProps {
  colorOption: ColorOption
  selected: boolean
  index: number
  size: number
}

export const ColorSwatch: React.FC<ColorSwatchProps> = props => {
  const { colorOption, size, index, selected } = props

  const colorHexMap: Record<ColorOption, string> = {
    orange: "#F7923A",
    darkblue: "#435EA9",
    gold: "#FFC749",
    darkgreen: "#388540",
    lightblue: "#438C97",
    lightgreen: "#BCCC46",
    yellow: "#FBE854",
    darkorange: "#F1572C",
    red: "#D73127",
    pink: "#B82C83",
    darkviolet: "#642B7F",
    violet: "#6C479C",
    "black-and-white": "#595A5B",
  }

  const blackAndWhiteDisplayColor = () => {
    if (index === 0) {
      return "#595A5B"
    } else {
      return "#FFFFFF"
    }
  }

  const interiorCircleColor = () => {
    if (colorOption === "black-and-white") {
      return blackAndWhiteDisplayColor()
    } else {
      return colorHexMap[colorOption]
    }
  }

  const exteriorCircleSize = size
  const interiorCircleSize = size * 0.625

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      alignContent={"center"}
      height={exteriorCircleSize}
      width={exteriorCircleSize}
      borderRadius={exteriorCircleSize / 2}
      style={{
        borderWidth: 1,
        borderColor: selected ? color("black100") : color("black10"),
      }}
    >
      <View
        style={{
          width: interiorCircleSize,
          height: interiorCircleSize,
          borderRadius: interiorCircleSize / 2,
          backgroundColor: interiorCircleColor(),
          borderWidth: 1,
          borderColor: color("black10"),
        }}
      />
    </Flex>
  )
}
