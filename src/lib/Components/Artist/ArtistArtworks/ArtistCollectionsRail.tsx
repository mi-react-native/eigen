import { Box } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistCollectionsRail_artist } from "__generated__/ArtistCollectionsRail_artist.graphql"
import { GenericArtistSeriesRail } from "lib/Components/GenericArtistSeriesRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Schema } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ArtistCollectionsRailProps {
  collections: ArtistArtworks_artist["iconicCollections"]
  artist: ArtistCollectionsRail_artist
}

export const ArtistCollectionsRail: React.FC<ArtistCollectionsRailProps> = props => {
  const { artist, collections } = props

  if (collections && collections.length > 1) {
    return (
      <Box>
        <Box mb={1}>
          <SectionTitle title="Iconic Collections" />
        </Box>
        <ArtistSeriesRailWrapper>
          <GenericArtistSeriesRail
            collections={collections}
            contextScreenOwnerType={Schema.OwnerEntityTypes.Artist}
            contextScreenOwnerId={artist.internalID}
            contextScreenOwnerSlug={artist.slug}
          />
        </ArtistSeriesRailWrapper>
      </Box>
    )
  }
  return null
}

const ArtistSeriesRailWrapper = styled(Box)`
  margin: 0px -20px 20px -40px;
`

export const ArtistCollectionsRailFragmentContainer = createFragmentContainer(ArtistCollectionsRail, {
  artist: graphql`
    fragment ArtistCollectionsRail_artist on Artist {
      internalID
      slug
    }
  `,

  collections: graphql`
    fragment ArtistCollectionsRail_collections on MarketingCollection @relay(plural: true) {
      slug
      id
      title
      priceGuidance
      artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
        edges {
          node {
            title
            image {
              url
            }
          }
        }
      }
    }
  `,
})
