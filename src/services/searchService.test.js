import { search } from "./searchService";
import { AT_ONTOLOGY, AT_VOCABULARY } from "./dataConstants";

jest.spyOn(Math, "random");

describe("Search service", () => {
  beforeEach(() => {
    Math.random.mockReturnValue(0);
  });

  test("should return all vocabularies, capped at 20", async () => {
    const items = await search({ type: AT_VOCABULARY });

    expect(items.length).toBe(20);
  });

  test("should find a vocabulary for 'Ripartizioni', looking for keyword", async () => {
    const items = await search({
      pattern: "Ripartizioni",
      type: AT_VOCABULARY,
    });

    expect(items.length).toBe(1);
    expect(items[0].uri).toBe(
      "https://w3id.org/italia/controlled-vocabulary/territorial-classifications/geographical-distribution"
    );
  });

  test("should find a vocabulary for 'ripartizioni', making keyword lowercase", async () => {
    const items = await search({
      pattern: "ripartizioni",
      type: AT_VOCABULARY,
    });

    expect(items.length).toBe(1);
    expect(items[0].uri).toBe(
      "https://w3id.org/italia/controlled-vocabulary/territorial-classifications/geographical-distribution"
    );
  });

  test("should find a vocabulary for 'generazione', searching in description", async () => {
    const items = await search({ pattern: "generazione", type: AT_VOCABULARY });

    expect(items.length).toBe(1);
    expect(items[0].uri).toBe(
      "https://w3id.org/italia/controlled-vocabulary/territorial-classifications/cities"
    );
  });

  test("should find all ontologies, capped at 20", async () => {
    const items = await search({ type: AT_ONTOLOGY });

    expect(items.length).toBe(16);
  });

  /* jscpd:ignore-start */
  test("should find vocabularies and ontologies, without a type filter", async () => {
    const items = await search({ pattern: "cittadini" });

    expect(items.length).toBe(3);
    expect(items.filter((a) => a.type === AT_VOCABULARY).length).toBe(2);
    expect(items.filter((a) => a.type === AT_ONTOLOGY).length).toBe(1);
  });

  test("should find vocabularies and ontologies, with a double type filter", async () => {
    const items = await search({
      pattern: "cittadini",
      type: [AT_VOCABULARY, AT_ONTOLOGY],
    });

    expect(items.length).toBe(3);
    expect(items.filter((a) => a.type === AT_VOCABULARY).length).toBe(2);
    expect(items.filter((a) => a.type === AT_ONTOLOGY).length).toBe(1);
  });

  test("should find vocabularies and ontologies, with a * filter", async () => {
    const items = await search({ pattern: "cittadini", type: "*" });

    expect(items.length).toBe(3);
    expect(items.filter((a) => a.type === AT_VOCABULARY).length).toBe(2);
    expect(items.filter((a) => a.type === AT_ONTOLOGY).length).toBe(1);
  });
  /* jscpd:ignore-end */
  test("should filter vocabularies on theme", async () => {
    const items = await search({
      theme: "http://publications.europa.eu/resource/authority/data-theme/EDUC",
      type: AT_VOCABULARY,
    });

    expect(items.length).toBe(14);
    items.forEach((i) =>
      expect(i.themes).toContainEqual(
        "http://publications.europa.eu/resource/authority/data-theme/EDUC"
      )
    );
  });

  test("should filter ontologies on theme", async () => {
    const items = await search({
      theme: "http://publications.europa.eu/resource/authority/data-theme/EDUC",
      type: AT_ONTOLOGY,
    });

    expect(items.length).toBe(6);
    items.forEach((i) =>
      expect(i.themes).toContainEqual(
        "http://publications.europa.eu/resource/authority/data-theme/EDUC"
      )
    );
  });
});
