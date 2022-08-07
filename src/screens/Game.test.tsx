/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { graphql } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, screen } from "@testing-library/react";
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from "..//utils/test-utils";
import Game from "./Game";

const TEST_CHARACTERS = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
  },
  {
    id: 3,
    name: "Summer Smith",
    status: "Alive",
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  },
];

export const handlers = [
  graphql.query("getCharacters", (req, res, ctx) => {
    return res(
      ctx.data({
        characters: {
          info: { next: false },
          results: TEST_CHARACTERS,
        },
      }),
      ctx.delay(333)
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Is winning a game if possible!", async () => {
  const { store } = renderWithProviders(<Game />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  const lastId = TEST_CHARACTERS[TEST_CHARACTERS.length - 1].id;
  // Loaded characters get displayed
  expect(await screen.findByTestId(`${lastId}`)).toBeInTheDocument();
  // Find Winner
  const idToFind = store.getState().game.characterToFind.id;
  // Clicking on Winner should bring up win screen
  fireEvent.click(screen.getByTestId(`${idToFind}`));
  expect(await screen.findByTestId("Winner")).toBeInTheDocument();
});

// TODO: Add similar test for loose state, erros when loadsing fails, also unit tests...
