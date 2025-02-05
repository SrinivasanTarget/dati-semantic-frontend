import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SearchResults from "./SearchResults";
import { AT_VOCABULARY } from "../../../services/dataConstants";
import SearchResultItem from "../SearchResultItem/SearchResultItem";

jest.mock("../SearchResultItem/SearchResultItem", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("<SearchResults />", () => {
  beforeEach(() => {
    SearchResultItem.mockClear();
    SearchResultItem.mockReturnValue(<div>The item</div>);
  });

  test("it should mount with empty results", () => {
    render(<SearchResults items={[]} />);

    const searchResults = screen.getByTestId("SearchResults");

    expect(searchResults).toBeInTheDocument();
  });

  describe("when empty", () => {
    test("it should show empty results message", () => {
      render(<SearchResults items={[]} />);

      const emptyMessage = screen.getByTestId("EmptySearchResults");

      expect(emptyMessage).toBeInTheDocument();
    });

    describe("with some vocabularies", () => {
      const someVocabs = [
        {
          type: AT_VOCABULARY,
          uri: "http://www.disney.com/characters/",
          title: "Disney characters",
          desc: "Some description",
        },
        {
          type: AT_VOCABULARY,
          uri: "http://www.atptour.com/court-types",
          title: "Tennis court types",
          desc: "Some other description",
        },
      ];

      test("it should not show empty results message for valid items", () => {
        render(<SearchResults items={someVocabs} />);

        const emptyMessage = screen.queryByTestId("EmptySearchResults");

        expect(emptyMessage).toBeFalsy();
      });

      test("it should show as many items as in result", () => {
        render(<SearchResults items={someVocabs} />);

        expect(SearchResultItem).toHaveBeenCalledTimes(someVocabs.length);
      });
    });
  });
});
