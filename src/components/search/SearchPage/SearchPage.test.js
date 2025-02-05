import React from "react";
import { act, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SearchPage from "./SearchPage";
import { search } from "../../../services/searchService";
import { AT_VOCABULARY } from "../../../services/dataConstants";
import { renderWithRoute } from "../../../services/testUtils";
import SearchResults from "../SearchResults/SearchResults";

jest.mock("../../../services/searchService");
jest.mock("../SearchResults/SearchResults", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("<SearchPage />", () => {
  beforeEach(() => {
    SearchResults.mockReturnValue(<p>A pragraph</p>);
    search.mockClear();
    search.mockResolvedValue([]);
  });

  test("it should mount", async () => {
    await act(async () => {
      renderWithRoute(<SearchPage />, "");
    });

    const vocabs = screen.getByTestId("SearchPage");

    expect(vocabs).toBeInTheDocument();
  });

  test("it should search with appropriate filters", async () => {
    await act(async () => {
      renderWithRoute(<SearchPage />, "/search?type=vocabulary&pattern=abc");
    });

    expect(search).toHaveBeenCalledWith({
      type: AT_VOCABULARY,
      pattern: "abc",
    });
  });

  describe("FilterBar", () => {
    beforeEach(() => {
      search.mockClear();
      search.mockResolvedValue([]);
    });

    test("it should show selected filter", async () => {
      await act(async () => {
        renderWithRoute(<SearchPage />, "/search?type=ontology");
      });

      const filter = screen.getByText("Ontologia");

      expect(filter).toBeInTheDocument();
    });

    test("it should not show any type filter", async () => {
      await act(async () => {
        renderWithRoute(<SearchPage />, "/search");
      });

      const filter = screen.queryByText("Ontologia");

      expect(filter).not.toBeInTheDocument();
    });
  });

  describe("With vocab results", () => {
    const someVocabs = [
      {
        type: AT_VOCABULARY,
        uri: "http://www.disney.com/characters/",
        title: "Disney characters",
      },
      {
        type: AT_VOCABULARY,
        uri: "http://www.atptour.com/court-types",
        title: "Tennis court types",
      },
    ];

    let resolve;
    const simulateVocabDataLoaded = () => {
      resolve(someVocabs);
    };

    beforeEach(() => {
      search.mockClear();
      search.mockReturnValue(
        new Promise((s) => {
          resolve = s;
        })
      );
    });

    test("it show propagate items to result component", async () => {
      await act(async () => {
        renderWithRoute(<SearchPage />, "/search?type=vocabulary");

        simulateVocabDataLoaded();
      });

      expect(SearchResults).toHaveBeenCalled();
      expect(SearchResults).toHaveBeenCalledWith({ items: someVocabs }, {});
    });
  });
});
