import { Box, Spacer } from "@artsy/palette"
import { ArtistNotableWorksRail_artist } from "__generated__/ArtistNotableWorksRail_artist.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ArtistNotableWorksRailProps {
  artist: ArtistNotableWorksRail_artist
}

type NotableArtwork = NonNullable<NonNullable<ArtistNotableWorksRail_artist["filterArtworksConnection"]>["edges"]>[0]

const ArtistNotableWorksRail: React.FC<ArtistNotableWorksRailProps> = ({ artist }) => {
  const artworks = artist?.filterArtworksConnection?.edges ?? []

  if (!artist || artworks.length <= 2) {
    return null
  }

  const navRef = React.useRef<any>()

  const handleNavigation = (slug: string | undefined) => {
    if (!slug) {
      return
    }
    return SwitchBoard.presentNavigationViewController(navRef.current, `/artwork/${slug}`)
  }
  const saleMessage = (artwork: NotableArtwork) => {
    const sale = artwork?.node?.sale
    const isAuction = sale?.isAuction

    if (isAuction) {
      const showBiddingClosed = sale?.isClosed
      if (showBiddingClosed) {
        return "Bidding closed"
      } else {
        const highestBidDisplay = artwork?.node?.saleArtwork?.highestBid?.display ?? ""
        const openingBidDisplay = artwork?.node?.saleArtwork?.openingBid?.display ?? ""

        return highestBidDisplay || openingBidDisplay || ""
      }
    }

    return artwork?.node?.saleMessage
  }

  return (
    <Box>
      <Box mb={1}>
        <SectionTitle title="Notable Works" />
      </Box>
      <ArtistNotableWorksRailWrapper>
        <AboveTheFoldFlatList<NotableArtwork>
          listRef={navRef}
          horizontal
          ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
          ListFooterComponent={() => <Spacer mr={2}></Spacer>}
          ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={artworks}
          initialNumToRender={3}
          windowSize={3}
          renderItem={({ item }) => {
            return (
              <ArtworkTileRailCard
                imageURL={item?.node?.image?.imageURL}
                artistNames={item?.node?.title}
                saleMessage={saleMessage(item)}
                key={item?.node?.internalID}
                useLargeImageSize
                useNormalFontWeight
                useLighterFont
                onPress={() => {
                  handleNavigation(item?.node?.slug)
                }}
              />
            )
          }}
          keyExtractor={(item, index) => String(item?.node?.internalID || index)}
        />
      </ArtistNotableWorksRailWrapper>
    </Box>
  )
}

const ArtistNotableWorksRailWrapper = styled(Box)`
  margin: 0px -20px 20px -20px;
`

export const ArtistNotableWorksRailFragmentContainer = createFragmentContainer(ArtistNotableWorksRail, {
  artist: graphql`
    fragment ArtistNotableWorksRail_artist on Artist {
      filterArtworksConnection(sort: "-weighted_iconicity", first: 10) {
        edges {
          node {
            id
            image {
              imageURL
            }
            saleMessage
            saleArtwork {
              openingBid {
                display
              }
              highestBid {
                display
              }
            }
            sale {
              isClosed
              isAuction
            }
            title
            internalID
            slug
          }
        }
      }
    }
  `,
})
