import { Box, CheckIcon, Theme } from "@artsy/palette"
import { FilterParamName, FilterType, InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { create, ReactTestRenderer } from "react-test-renderer"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFiltersStore"
import { InnerOptionListItem } from "../SingleSelectOption"
import { SortOptionsScreen } from "../SortOptions"

describe("Sort Options Screen", () => {
  let mockNavigator: MockNavigator
  let state: ArtworkFilterContextState

  beforeEach(() => {
    mockNavigator = new MockNavigator()
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }
  })

  const MockSortScreen = ({ initialState }: InitialState) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            // @ts-ignore STRICTNESS_MIGRATION
            dispatch: null,
          }}
        >
          <SortOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const selectedSortOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter(item => item.findAllByType(Box).length > 0)[0]
    return selectedOption
  }

  it("renders the correct number of sort options", () => {
    const tree = create(<MockSortScreen initialState={state} />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(7)
  })

  describe("selectedSortOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const tree = create(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Default")
    })

    it("prefers an applied filter over the default filter", () => {
      state = {
        selectedFilters: [],
        appliedFilters: [
          {
            displayText: "Recently added",
            filterType: FilterType.sort,
            paramName: FilterParamName.sort,
            paramValue: "Recently added",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently added",
            filterType: FilterType.sort,
            paramName: FilterParamName.sort,
            paramValue: "Recently added",
          },
        ],
        applyFilters: false,
      }

      const tree = create(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })

    it("prefers the selected filter over the default filter", () => {
      state = {
        selectedFilters: [
          {
            displayText: "Recently added",
            filterType: FilterType.sort,
            paramName: FilterParamName.sort,
            paramValue: "Recently added",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const tree = create(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })

    it("prefers the selected filter over an applied filter", () => {
      state = {
        selectedFilters: [
          {
            displayText: "Recently added",
            filterType: FilterType.sort,
            paramName: FilterParamName.sort,
            paramValue: "Recently added",
          },
        ],
        appliedFilters: [
          {
            displayText: "Recently updated",
            filterType: FilterType.sort,
            paramName: FilterParamName.sort,
            paramValue: "Recently updated",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently updated",
            filterType: FilterType.sort,
            paramName: FilterParamName.sort,
            paramValue: "Recently updated",
          },
        ],
        applyFilters: false,
      }

      const tree = create(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })
  })

  it("allows only one sort filter to be selected at a time", () => {
    state = {
      selectedFilters: [
        {
          displayText: "Price (high to low)",
          filterType: FilterType.sort,
          paramName: FilterParamName.sort,
          paramValue: "Price (high to low)",
        },
        {
          displayText: "Price (low to high)",
          filterType: FilterType.sort,
          paramName: FilterParamName.sort,
          paramValue: "Price (low to high)",
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }
    const tree = create(<MockSortScreen initialState={state} />)
    const selectedRow = selectedSortOption(tree)
    expect(extractText(selectedRow)).toEqual("Price (high to low)")
    expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1)
  })
})
